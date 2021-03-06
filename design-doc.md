## 功能概述
1. 账单列表展示
2. 账单按类型（收入、支出）统计
3. 账单按分类统计
4. 添加账单
5. 数据云存储，可跨设备使用

## 技术设计
实用的web需要将数据存储在云端，让用户任何时间、任何地点、任何设备都可以访问，有必要搭建后端服务。当前业界成熟的做法是前后端分离，通过http接口通信，后端实现核心业务逻辑和数据存储，前端做展现和交互，这样的项目架构使工程师能更专注做精各自的领域，再配合模块化的思想，才能够支撑住日期复杂的业务逻辑。所以按实战项目的要求来设计记账本，需要采用前后端分离和模块化的项目架构。

### 前端设计

#### 技术栈
vue + elementui + echartjs

vue：引入熟悉的mvvm数据驱动和组件化开发提高开发效率和代码可读性
elementui：引入熟悉的成熟PC端vue组件库避免重复造轮子，提高开发效率
echartjs：熟悉的成熟数据可视化组件库，用于以图表形式展示统计信息
axios：成熟的http请求库，相比fetch兼容性更好

#### 交互设计
记账本页面分为4部分，从上到下依次为**表单筛选**、**总览**、**分类统计**、**账单明细**、**添加账单对话框**
1. 表单筛选: 支持通过月份筛选账单；支持通过分类筛选账单，支持多选和模糊搜索；筛选条件和页面参数同步，刷新页面不会导致状态丢失；
2. 总览：所选月份账单按收入、支出的金额统计
3. 分类统计：所选月份按类别的金额统计，通过柱状图展示有更好的对比展示效果
4. 账单明细：所选月份的所有账单，按时间排序
5. 添加账单对话框：添加账单，带输入校验，添加成功后刷新统计数据和明细数据

### 服务端设计
#### 技术栈
koa + sqlite 

koa：个人非常熟悉的业界流行的nodejs服务端框架，相比express更精简、工作原理更容易理解，适合搭建业务api服务

为什么选sqlite作为数据存储方案：
1. 直接读写csv：无索引效率低，查询、更新或写入都需要解析整个文件；且无法支持并行写操作；
2. 通过内存数据库间接读写csv，如[nedb](https://github.com/louischatriot/nedb): 不支持group by做数据统计；数据量过大时会导致内存溢出；
3. sqlite: 文件数据库，非常方便通过sql做增删改查和统计，由于不需要搭建复杂的环境即可运行，特别适合demo演示和小应用，后续如需要考虑分布式、负载均衡可切换为mysql

#### 接口文档


## 代码库
1. 前端：https://github.com/zzz945/xmind-assignment-account-book
2. 服务端：https://github.com/zzz945/xmind-assignment-account-book-api

## 运行项目
目前仅提供开发环境（mac）运行项目的方法：
1. 启动后台服务：参考https://github.com/zzz945/xmind-assignment-account-book
2. 启动前端服务：参考https://github.com/zzz945/xmind-assignment-account-book-api
