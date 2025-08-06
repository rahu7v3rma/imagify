pm2 delete imagify || true
pm2 start npm --name "imagify" -- start