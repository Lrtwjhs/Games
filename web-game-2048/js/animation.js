/*
animation.js
控制动画
*/

// 新数字生成时
function showNumberAnimation(i, j, randNumber) {
    // randNumber为随机的数字
    var numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css('background-color', getNumberBackgroundColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width: '100px',
        height: '100px',
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}

// 数字移动时
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy);
    numberCell.animate({
        top: getPosTop(tox,toy),
        left: getPosLeft(tox, toy)
    }, 200);
}