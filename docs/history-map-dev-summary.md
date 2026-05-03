# 历史地图功能开发问题总结

## 时间边界问题

### 问题1: 朝代时间重叠导致多个疆域同时显示
- **现象**: 点击某个朝代时，会同时显示上一个朝代的疆域
- **原因**: 相邻朝代的 startYear/endYear 首尾相连（如汉朝 endYear=220，三国 startYear=220）
- **解决方案**: 每个朝代时间边界用 -1 错开
  - 商朝: -1600 ~ -1047
  - 周朝: -1046 ~ -257
  - 春秋: -770 ~ -477
  - 战国: -475 ~ -222
  - 秦朝: -221 ~ -207
  - 汉朝: -202 ~ 219
  - 三国: 220 ~ 279

### 问题2: 春秋战国显示周朝疆域
- **现象**: 春秋时期显示周朝疆域，战国时期显示春秋疆域
- **原因**: 数据过滤逻辑只按年份匹配，没有排除父级朝代
- **解决方案**: 在 MapViewer.tsx 中添加过滤逻辑
  ```typescript
  // Skip zhou when more specific periods are active
  if (id === 'zhou-dynasty' && year >= -770) return;
  // Skip song when yuan is active (1271+)
  if (id === 'song-dynasty' && year >= 1271) return;
  ```

### 问题3: 元朝显示宋朝疆域
- **解决方案**: 同上，排除逻辑
  ```typescript
  if (id === 'song-dynasty' && year >= 1271) return;
  ```

---

## 数据问题

### 问题4: 新增朝代没有疆域数据
- **原因**: mockData.ts 中没有添加该朝代的 Polygon 数据
- **解决方案**: 为每个新朝代添加 mockData 条目，包括：
  - id, nameKey, descKey, type, startYear, endYear, tags, lodLevel
  - geometry (Polygon 坐标)

### 问题5: 春秋和战国疆域相同
- **原因**: 两个时期的 Polygon 坐标一样
- **解决方案**: 让战国时期范围更大
  - 春秋: `[[108.0, 38.0], [118.0, 38.0], ...]`
  - 战国: `[[100.0, 42.0], [125.0, 42.0], ...]`

---

## 翻译问题

### 问题6: 新增朝代没有中文翻译
- **解决方案**: 在 locales/zh.json 和 en.json 中添加
  ```json
  "type_xxx": "朝代名",
  "desc_xxx": "描述"
  ```

---

## 性能问题

### 问题7: 播放时一直闪烁显示"加载中"
- **原因**: 
  1. useEffect 依赖项包含 loadData 函数，导致每次 render 都重新加载
  2. 加载状态 isLoading 在快速切换时闪烁
- **解决方案**: 
  1. 使用 loadingRef 防止重复加载
  2. 使用 lastYearRef 跳过相同年份
  3. 移除"加载中"显示，或者只在真正加载时显示
  ```typescript
  const lastYearRef = useRef<number>(0);
  
  const loadData = useCallback(async () => {
    const year = useHistoryMapStore.getState().currentYear;
    if (year === lastYearRef.current) return;
    lastYearRef.current = year;
    // ... 加载逻辑
  }, [currentYear, lodLevel]);
  ```

---

## Timeline 显示问题

### 问题8: 秦朝/三国/五代十国等需要显示在不同高度
- **解决方案**: 使用 position 字段控制显示位置
  - position: 0 = 底部
  - position: 1 = 底部 + offset (20px)
  ```typescript
  { nameKey: 'type_dynasty_qin', startYear: -221, endYear: -207, position: 1 },
  ```

### 问题9: bottom vs top 定位问题
- **原因**: 使用 top 导致标签显示在轴上方，不符合中文习惯
- **解决方案**: 统一使用 bottom 定位
  ```typescript
  bottom: seg.position === 1 ? '20px' : '0px',
  ```

---

## 地图交互问题

### 问题10: 搜索和放大缩小按钮冗余
- **解决方案**: 从 HistoryMapPage.tsx 中移除 HistorySearch 组件
- **解决方案**: 在 MapViewer.tsx 中设置 zoomControl={false}

---

## 开发规范

### 1. 添加新朝代 checklist
- [ ] 在 TimelineSlider.tsx 添加 dynastyRanges 条目（注意时间边界）
- [ ] 在 mockData.ts 添加 Polygon 数据
- [ ] 在 locales/zh.json 添加翻译
- [ ] 在 locales/en.json 添加翻译
- [ ] 测试时间边界不重叠

### 2. 时间边界定义规则
- 每个朝代用 1 年分隔（如 219 结束，220 开始）
- 避免首尾相连: `endYear = nextStartYear - 1`
- 测试时在两个朝代交界年份切换，确认不重叠

### 3. 数据过滤规范
- 如果有子时期（如三国），父时期（如汉）需要被排除
- 使用 id 匹配进行条件排除
- 优先显示更具体的时期

### 4. 播放性能规范
- 使用 ref 记录上一次的年份
- 只有年份变化才触发数据加载
- 避免每次 render 都调用 API

---

## 相关文件

- `/projects/doc-viewer/src/features/history-map/`
  - `TimelineSlider.tsx` - 时间轴组件
  - `MapViewer.tsx` - 地图组件
  - `HistoryMapPage.tsx` - 页面组件
  - `data/mockData.ts` - 疆域数据
  - `services/historyDataService.ts` - 数据服务
  - `store/useMapStore.ts` - 状态管理