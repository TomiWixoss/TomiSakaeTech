# Hướng dẫn cấu hình Google Drive API

## Tổng quan

Ứng dụng sử dụng OAuth2 với Refresh Token để truy cập Google Drive API. Cách này cho phép upload file vào Drive của bạn mà không cần user đăng nhập.

> **Lưu ý:** Không dùng Service Account vì Service Account không có storage quota, chỉ có thể đọc file được share, không thể upload.

## Bước 1: Tạo Project trên Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Library**
4. Tìm và enable **Google Drive API**

## Bước 2: Tạo OAuth2 Credentials

1. Vào [APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **Create Credentials** → **OAuth client ID**
3. Nếu chưa cấu hình OAuth consent screen:
   - Chọn **External** (cho tài khoản cá nhân)
   - Điền tên app, email support
   - Thêm scope: `https://www.googleapis.com/auth/drive`
   - Thêm email của bạn vào Test users
4. Quay lại tạo OAuth client ID:
   - Application type: **Web application**
   - Name: Tên tùy ý
   - Authorized redirect URIs: thêm `https://developers.google.com/oauthplayground`
5. Copy **Client ID** và **Client Secret**

## Bước 3: Publish App (Quan trọng!)

Để refresh token không hết hạn sau 7 ngày:

1. Vào [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
2. Click **Publish App**
3. Xác nhận chuyển từ Testing → Production

> Nếu không publish, refresh token sẽ hết hạn sau 7 ngày.

## Bước 4: Lấy Refresh Token

1. Truy cập [Google OAuth Playground](https://developers.google.com/oauthplayground)

2. Click biểu tượng ⚙️ (Settings) góc phải trên

3. Check ✅ **Use your own OAuth credentials**

4. Nhập:
   - OAuth Client ID: `your_client_id.apps.googleusercontent.com`
   - OAuth Client secret: `your_client_secret`

5. Đóng Settings

6. Ở panel bên trái, tìm **Drive API v3** → check ✅ `https://www.googleapis.com/auth/drive`

7. Click **Authorize APIs**

8. Đăng nhập với tài khoản Google mà bạn muốn dùng làm storage

9. Click **Exchange authorization code for tokens**

10. Copy **Refresh token** từ response

**Response mẫu (sau khi publish app):**
```json
{
  "access_token": "ya29.xxx...",
  "scope": "https://www.googleapis.com/auth/drive",
  "token_type": "Bearer",
  "expires_in": 3599,
  "refresh_token": "1//04xxx..."
}
```

> Nếu thấy `refresh_token_expires_in` trong response, app chưa được publish!

## Bước 5: Cấu hình Environment Variables

Thêm vào file `.env`:

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_ROOT_FOLDER_ID=your_folder_id
```

### Lấy GOOGLE_DRIVE_ROOT_FOLDER_ID

1. Mở Google Drive
2. Tạo hoặc mở folder bạn muốn dùng làm root
3. Copy ID từ URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`

## Cấu trúc Code

### `src/lib/googleAuth.ts`
```typescript
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export const drive = google.drive({ version: "v3", auth: oauth2Client });
export const oauth2 = oauth2Client;
```

### Sử dụng trong API routes
```typescript
import { drive } from "@/lib/googleAuth";

// Upload file
const response = await drive.files.create({
  requestBody: { name: fileName, parents: [folderId] },
  media: { mimeType, body: fileStream },
  fields: "id",
});

// List files
const response = await drive.files.list({
  q: `'${folderId}' in parents and trashed = false`,
  fields: "files(id, name, mimeType, size)",
});
```

## Troubleshooting

### Lỗi "Service Accounts do not have storage quota"
→ Bạn đang dùng Service Account. Chuyển sang OAuth2 theo hướng dẫn trên.

### Lỗi "invalid_client"
→ Client ID hoặc Client Secret sai. Kiểm tra lại credentials.

### Lỗi "redirect_uri_mismatch"
→ Redirect URI chưa được thêm vào OAuth client. Thêm `https://developers.google.com/oauthplayground` vào Authorized redirect URIs.

### Refresh token hết hạn sau 7 ngày
→ App chưa được publish. Vào OAuth consent screen và click Publish App.

### Lỗi 403 khi upload từ browser
→ CORS issue. Upload phải đi qua server-side API, không upload trực tiếp từ browser đến googleapis.com.

## Thời hạn Token

| Loại | Thời hạn |
|------|----------|
| Access Token | 1 giờ (tự động refresh) |
| Refresh Token (Testing mode) | 7 ngày |
| Refresh Token (Production mode) | Vĩnh viễn* |

*Refresh token sẽ bị vô hiệu nếu:
- Revoke quyền truy cập trong Google Account
- Không sử dụng trong 6 tháng
- Đổi mật khẩu Google
- Vượt quá 50 refresh tokens cho cùng client ID + user
