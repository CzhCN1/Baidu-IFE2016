#听指令的小方块
##[demo](http://gentlemanczh.com/works/Baidu_IFE/mission-35/)
##预实现功能
1. 命令输入框由input变为textarea，可以允许输入多条指令，每一行一条
2. textarea左侧有一列可以显示当前行数的列（代码行数列），列数保持和textarea中一致
3. 当textarea发生上下滚动时，代码行数列同步滚动
4. 能够判断指令是否合法，不合法的指令给出提示（如图）
5. 点击执行时，依次逐条执行所有命令
6. 对于GO，TRA以及MOV指令增加可以移动格子数量的参数，例如
7. GO 3：向当前方向前进三格
8. TRA TOP 2：向屏幕上方平移两格
9. MOV RIG 4：方向转向屏幕右侧，向屏幕的右侧移动四格  