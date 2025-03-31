<template>
  <el-dialog v-model="editDialogVisible" title="编辑节点内容" width="30%">
    <el-input v-model="editText" />
    <template #footer>
      <span class="dialog-footer">
        <button @click="editDialogVisible = false">取消</button>
        <button @click="confirmEdit">确定</button>
      </span>
    </template>
  </el-dialog>

  <div class="flow-container">
    <div class="input-area">
      <textarea v-model="inputText" placeholder="输入流程图文本（示例：登录 → 验证短信 → 进入主页）" rows="3" />
      <div class="action-buttons">
        <button @click="generateFlow">生成流程图</button>
        <button @click="exportPNG">导出PNG</button>
      </div>
    </div>
    <div ref="container" class="graph-container"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Graph } from '@antv/x6'
import { Export } from '@antv/x6-plugin-export'
import { History } from '@antv/x6-plugin-history';
import { ElDialog, ElInput } from 'element-plus'


const inputText = ref('登录 → 验证短信 → 进入主页')
const container = ref(null)
const graph = ref(null)


let editText  = ref('') // 编辑的文本
let editingNode = ref(null) // 当前编辑的节点
let editDialogVisible = ref(false) // 编辑对话框是否可见

// 初始化图表
onMounted(() => {
  graph.value = new Graph({
    container: container.value,
    background: { color: '#F2F7FA' },
    grid: true,
    connecting: {
      router: 'manhattan',
      connector: 'rounded',
    },
  })

  graph.value.use(new Export())
  graph.value.use(new History())  // 使用历史记录插件

  // 监听键盘事件,
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
      graph.value.undo()
    }
    if (e.ctrlKey && e.key === 'y') {
      graph.value.redo()
    }
  })

  // 双击编辑节点文本
  graph.value.on('node:dblclick', ({ node }) => {
    editText.value = node.attr('text/text')
    editingNode.value = node
    editDialogVisible.value = true
  })
})

// 确认编辑
const confirmEdit = () => {
  if (editingNode.value) {
    editingNode.value.attr('text/text', editText.value)
  }
  editDialogVisible.value = false
}

// 解析文本生成流程图
const generateFlow = () => {
  if (!inputText.value) return

  graph.value.clearCells()

  const steps = inputText.value.split('→').map(s => s.trim())
  const nodes = []
  const edges = []

  steps.forEach((text, i) => {
    nodes.push({
      id: `node${i}`,
      shape: 'rect',
      x: 100 + i * 200,
      y: 100,
      width: 120,
      height: 40,
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
        text: { text }
      },
      // 添加可连接端口
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          { group: 'top' },
          { group: 'bottom' },
        ],
      }
    })

    if (i > 0) {
      edges.push({
        source: { cell: `node${i - 1}`, port: 'bottom' },
        target: { cell: `node${i}`, port: 'top' },
        attrs: {
          line: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
        // 使连线可重新连接
        connector: 'rounded',
        router: {
          name: 'manhattan',
        },
      })
    }
  })

  graph.value.fromJSON({ nodes, edges })
  graph.value.centerContent()

  // 启用连线重连功能
  graph.value.enableRubberband()
  graph.value.enableHistory()
}

// 导出PNG
const exportPNG = () => {

  graph.value.toPNG((dataUrl) => {
    const link = document.createElement('a')
    link.download = 'flowchart.png'
    link.href = dataUrl
    link.click()
  }, {
    padding: 10,
    quality: 1,
  })
}

</script>

<style scoped>
.flow-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.input-area {
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.graph-container {
  flex: 1;
  width: 100%;
}

textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.action-buttons {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

button {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>