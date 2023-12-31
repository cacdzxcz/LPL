# LPL 数据分析与可视化项目

## 项目简介

这是一个用于分析和可视化LPL（英雄联盟职业联赛）数据的项目。我们利用Python、javascript、MySQL等工具对LPL比赛数据进行分析，并通过可视化展示有趣的趋势和统计结果。

## 如何运行项目

我们的项目需要后端数据库的支撑，需要首先创建一个名为lpl的数据库。并且其中还需要诸如战队数据等图表，如有相关需要或者关于数据库的问题请联系我们。

### 环境设置

1. 安装Python（建议使用 Python 3.8 版本）：[Python 官方网站](https://www.python.org/)

2. 安装依赖包：

    ```bash
    pip install flask, pymysql
    ```

### 运行脚本

1. 克隆项目仓库：

    ```bash
    git clone https://github.com/cacdzxcz/LPL.git
    ```

2. 进入项目目录：

    ```bash
    cd LPL
    ```

3. 运行分析脚本：

    ```bash
    python app.py
    ```

## 项目结构

我们项目的界面在templates下，包含有主界面、战队界面和选手界面三个html文件。其余的包括静态图片，以及css样式和js文件等都在static目录下。

## 项目展示

1、战队数据对比界面

![主界面](./images/主界面.png)

2、战队详细信息界面

![战队界面](./images/战队界面.png)

3、选手详细信息界面

![战队界面](./images/选手界面.png)

