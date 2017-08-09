/*
 main.js
 控制操作逻辑
 * */

// 格子 4*4
var board = new Array();
// 分数
var score;

// 页面加载完成执行新游戏
$(document).ready(function() {
    newgame();
});

// 执行新动画
$('#newgameButton').click(function() {
    newgame();
})

function newgame() {
    // 初始化
    init();
    // 随机两个格子是生成数字
    // 新游戏开始时时生成两个数字，因此执行两次
    generateOneNumber();
    generateOneNumber();
    score = -8;
}

// 初始化
function init() {
    // 对小格子进行定位
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j);
            // 需要移动的距离
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }
    // 使用二维数组来存储值
    // 每个区域的值都是0
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }
    updateBoardView();
}

// 添加新的4*4格子
function updateBoardView() {
    // 首先移除后面设置的格子
    $('.number-cell').remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                // 当新格子内的值为0时，新格子不占区域，并处于下方格子中心
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            } else {
                // 当新格子内的值不为0时，为格子和值添加颜色和数字
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
    }
}


// 新数字
function generateOneNumber() {
    // 是否有空格
    if (nospace(board)) {
        return false;
    }
    //随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
    // 判断该位置是否能用，即是否为0
    while (true) {
        if (board[randx][randy] == 0) {
            break;
        }
        // 如果不能用，则重新生成
        randx = parseInt(Math.floor(Math.random() * 4));
        randy = parseInt(Math.floor(Math.random() * 4));
    }
    // 随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    // 随机位置显示随机数
    board[randx][randy] = randNumber;
    showNumberAnimation(randx, randy, randNumber);

    // 
    setTimeout("addBoard()", 50);

    return true;
}

// 添加计数器
function addBoard() {
    score += 4;
    $('#score').text(score);
}

// 
$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: //left
            // 判断是否能移动
            if (moveLeft()) {
                // 添加随机数
                setTimeout("generateOneNumber()", 210);
                // 判断游戏是否能继续
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        default: //default
            break;
    }
});

// 既没有空格也不能移动时
function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

// 游戏结束
function gameover() {
    alert('Game Over !');
}



// 控制操作

function moveLeft() {
    // 判断是否能向左移动
    if (!canMoveLeft(board)) {
        return false;
    }

    // moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        // move
                        showMoveAnimation(i, j, i, k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }
    // 每次移动都要添加新的格子
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }

    // moveRight
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)) {
                        showMoveAnimation(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }

    // moveUp
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }

    // moveDown
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout('updateBoardView()', 200);
    return true;
}