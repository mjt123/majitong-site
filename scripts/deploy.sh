#!/usr/bin/env bash
# 部署到阿里云轻量服务器（47.93.199.134，SSH 别名 hermes-agent）。
# 用法：先 npm run build，然后 bash scripts/deploy.sh
set -euo pipefail

[ -f dist/index.html ] || { echo "dist/ 不存在，先跑 npm run build"; exit 1; }
ssh -o BatchMode=yes hermes-agent "echo SSH OK" || { echo "SSH 连不上（检查密钥/服务器）"; exit 1; }

# 全量覆盖：先清空 web 根目录再解包（构建产物带哈希，残留只会占空间）
tar -C dist -cf - . | ssh -o BatchMode=yes hermes-agent \
  "sudo find /usr/share/nginx/html -mindepth 1 -delete && sudo tar -C /usr/share/nginx/html -xf - && sudo nginx -t -q && sudo systemctl reload nginx"

echo "部署完成 → http://47.93.199.134/"
