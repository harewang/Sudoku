if (!Array.prototype.argsMove) {
    Array.prototype.argsMove = function (n) {
        //将数组首位n个值移到末尾
        var tmp = this.concat();
        if (n === 0) 
            return tmp;

        return function (i) {
            return (tmp.push(tmp.shift())) & (i++ === n) ? 
                tmp : arguments.callee(i);
        }(1);
    }
}

var Sudoku = function () {
    var digits = [];
    var that = this;
    this.result = [];

    this.load = function () {
        var nums = [1,2,3,4,5,6,7,8,9];

        for (var i = 0; i < 9; i++) {
            if (i % 3 === 0) {
                digits[i] = nums.argsMove(i / 3);
            } else {
                digits[i] = digits[Math.floor(i/3)*3].argsMove(i%3 * 3);
            }
            this.result[i] = digits[i].concat();
        }

        generate();
        print();
    };

    this.check = function (i, j, num) {
        for (var row = 0; row < 9; row++) {
            if (this.result[row][j] && this.result[row][j] == num) {
                return false;
            }
        }

        for (var col = 0; col < 9; col++) {
            if (this.result[i][col] && this.result[i][col] == num) {
                return false;
            }
        }

        for (var row = i-i%3; row < (i-i%3)+3; row++) {
            for (var col = j-j%3; col < (j-j%3)+3; col++) {
                if (this.result[row][col] && this.result[row][col]=== num) {
                    return false;
                }
            }
        }

        return true;
    }

    function generate () {
        for (var i = 0; i < 9; i+=3) {
            var index = function (i) {
                return new Array(i, i+1, i+2).sort(function(a, b) {
                    return Math.random() - 0.4;
                })
            }(i);
            
            for (var j = 0; j < 3; j++) {
                for (var k = 0; k < 9; k++) {
                    that.result[k][i + j] = digits[k][index[j]];
                }
            }
        }
        digits = that.result.concat();

        for (var i = 0; i < 9; i+=3) {
            var index = function (i) {
                return new Array(i, i+1, i+2).sort(function(a, b) {
                    return Math.random() - 0.4;
                })
            }(i);
            
            for (var j = 0; j < 3; j++) {
                that.result[i + j] = digits[index[j]];
            }
        }
    }

    function print () {
        var omit = Math.floor(Math.random() * 10 + 50);
        while (omit) {
            var row = Math.floor(Math.random() * 9);
            var col = Math.floor(Math.random() * 9);

            if (that.result[row][col]) {
                that.result[row][col] = null;
                omit--;
            }
        }

        var sudoku = document.getElementById('sudoku');
        for (var i = 0; i < 9; i++) {
            var tmp = document.createElement('div');
            sudoku.appendChild(tmp);

            for (var j = 0; j < 9; j++) {
                var span = document.createElement('span');
                if (that.result[i][j]) {
                    span.innerHTML = that.result[i][j];
                    span.className = 'filled';
                } else {
                    span.className = 'unfilled'
                }
                tmp.appendChild(span);
            }
        }
    }
};

var mySudoku = new Sudoku();
mySudoku.load();

var spans = document.getElementById('sudoku').getElementsByTagName('span');
for (var i = 0; i < spans.length; i++) {
    if (spans[i].className === 'unfilled') {
        spans[i].onclick = fill(i);
    }
} 

function fill (i) {
    var that = spans[i];
    var row = Math.floor(i / 9);
    var col = i % 9;
    var unfilled = document.getElementsByClassName('unfilled');
    var select = document.getElementById('select');
    var selects = select.getElementsByTagName('span');
    var tip = document.getElementById('tip');
    var cancel = select.getElementsByTagName('div')[0];

    return function (ev) {
        tip.innerHTML = '';
        that.style.background = '#88B1BC';
        select.style.background = '#B4B8C3';

        for (var j = 0; j < selects.length; j++) {
            selects[j].onclick = function () {
                if (mySudoku.check(row, col, parseInt(this.innerHTML))) {
                    that.innerHTML = this.innerHTML;
                    mySudoku.result[row][col] = parseInt(this.innerHTML);
                } else {
                    tip.innerHTML = '该处不能填此数';
                }
            }
            cancel.onclick = function () {
                that.innerHTML = '';
                mySudoku.result[row][col] = null;
            }
        }
        
        document.onclick = function () {
            for (var j = 0; j < selects.length; j++) {
                selects[j].onclick = null;
            }
            that.style.background = '#E3EBF6';
            select.style.background = '';
        }
        ev.stopPropagation();
    }
}