# 如何重新运行 GitHub Actions 工作流

## 方法 1: 在 GitHub 网页上重新运行（推荐）

### 步骤 1: 打开 Actions 标签页

1. 访问你的仓库: https://github.com/bryaninjapan/Bitquant
2. 点击顶部的 **Actions** 标签页

### 步骤 2: 找到失败的工作流运行

1. 在左侧边栏，点击 **"Build and Deploy"** 工作流
2. 在运行列表中，找到最新的一次运行（通常是失败的）
3. 点击该运行记录进入详情页

### 步骤 3: 重新运行

1. 在运行详情页的右上角，点击 **"Re-run jobs"** 下拉菜单
2. 选择以下选项之一：
   - **"Re-run all jobs"** - 重新运行所有任务
   - **"Re-run failed jobs"** - 只重新运行失败的任务

### 步骤 4: 等待完成

- 工作流会重新开始执行
- 可以在页面上实时查看进度
- 通常需要 2-5 分钟完成

## 方法 2: 使用 workflow_dispatch 手动触发

### 步骤 1: 打开工作流

1. 访问: https://github.com/bryaninjapan/Bitquant/actions
2. 在左侧边栏，点击 **"Build and Deploy"** 工作流

### 步骤 2: 手动运行

1. 在右侧找到 **"Run workflow"** 按钮
2. 点击按钮
3. 选择分支（通常是 `main`）
4. 点击绿色的 **"Run workflow"** 按钮

## 方法 3: 通过推送代码触发

### 方法 A: 空提交（不改变代码）

```bash
git commit --allow-empty -m "chore: Trigger workflow"
git push origin main
```

### 方法 B: 修改并提交文件

```bash
# 修改任意文件（比如添加一个空格）
echo " " >> README.md
git add README.md
git commit -m "chore: Trigger workflow"
git push origin main
```

## 方法 4: 使用 GitHub CLI（如果已安装）

```bash
# 列出工作流
gh workflow list

# 运行工作流
gh workflow run "Build and Deploy"
```

## 📝 注意事项

1. **确保 GitHub Pages 已启用**
   - 在重新运行之前，确保已在 Settings → Pages 中启用了 GitHub Pages
   - Source 必须选择 "GitHub Actions"

2. **查看实时日志**
   - 在 Actions 页面可以实时查看每个步骤的输出
   - 如果失败，可以查看具体哪个步骤出错

3. **等待时间**
   - 构建通常需要 1-2 分钟
   - 部署需要额外 1-2 分钟
   - 总共大约 3-5 分钟

4. **检查部署状态**
   - 部署成功后，访问: https://bryaninjapan.github.io/Bitquant/
   - 如果显示 404，可能需要等待几分钟让 GitHub Pages 更新

## 🔍 故障排除

### 如果重新运行仍然失败

1. **检查 GitHub Pages 设置**
   - 确保已启用并选择 "GitHub Actions"

2. **查看错误日志**
   - 点击失败的步骤查看详细错误信息

3. **检查权限**
   - 确保仓库有 Actions 权限
   - 确保工作流有正确的 permissions 配置

4. **清除缓存（如果需要）**
   - 可以在工作流中添加清除缓存的步骤

