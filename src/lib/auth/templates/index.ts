import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const emailVerificationTemplate = (url: string) => {
  const rootDir = path.join(process.cwd(), "src", "lib", "auth", "templates");
  const htmlContent = fs.readFileSync(
    path.join(rootDir, "emailVerification.html")
  );
  const textContent = fs.readFileSync(
    path.join(rootDir, "emailVerification.txt")
  );
  return {
    html: htmlContent.toString().replace("{{url}}", url),
    text: textContent.toString().replace("{{url}}", url),
  };
};

export const newUserNotificationTemplate = (username: string) => `
  <html>
    <body>
      <h1>New User Notification</h1>
      <p>A new user has signed up: ${username}</p>
    </body>
  </html>
`;
