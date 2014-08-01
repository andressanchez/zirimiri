Raphael.fn.arrow = function (_sx, _sy, _tx, _ty, size)
{
    var curviness = 20;
    var proximityLimit = 120;
    var _midx = (_sx + _tx) / 2, _midy = (_sy + _ty) / 2,
        m2 = (-1 * _midx) / _midy, theta2 = Math.atan(m2),
        dy =  (m2 == Infinity || m2 == -Infinity) ? 0 : Math.abs(curviness / 2 * Math.sin(theta2)),
        dx =  (m2 == Infinity || m2 == -Infinity) ? 0 : Math.abs(curviness / 2 * Math.cos(theta2)),
        segment = _segment(_sx, _sy, _tx, _ty),
        distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2)),

        // calculate the control point.  this code will be where we'll put in a rudimentary element avoidance scheme; it
        // will work by extending the control point to force the curve to be, um, curvier.
        _controlPoint = _findControlPoint(_midx,
            _midy,
            segment,
            [_sx, _sy],
            [_tx, _ty],
            curviness, curviness,
            distance,
            proximityLimit);

    var angle = Math.atan2(_tx-_controlPoint[0],_controlPoint[1]-_ty);
    angle = (angle / (2 * Math.PI)) * 360;

    var arrowPath = this.path("M" + _tx + " " + _ty + " L" + (_tx  - size) + " " + (_ty  - size) + " L" + (_tx  - size)  + " " + (_ty  + size) + " L" + _tx + " " + _ty ).attr("stroke","#7d7d7d").attr("fill","#7d7d7d").rotate((270+angle),_tx,_ty);
    var linePath = this.path("M" + _sx + " " + _sy + "C " + _controlPoint[0] + " " + _controlPoint[1] + " " + _controlPoint[0] + " " + _controlPoint[1] + " " + _tx + " " + _ty).attr("stroke","#7d7d7d").attr("stroke-width", 2);
    return {linePath: linePath, arrowPath: arrowPath};
};

function getRelativePosition(element) {
    return {
        y: element.offsetTop,
        x: element.offsetLeft
    };
}

function getAbsolutePosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

// the control point we will use depends on the faces to which each end of the connection is assigned, specifically whether or not the
// two faces are parallel or perpendicular.  if they are parallel then the control point lies on the midpoint of the axis in which they
// are parellel and varies only in the other axis; this variation is proportional to the distance that the anchor points lie from the
// center of that face.  if the two faces are perpendicular then the control point is at some distance from both the midpoints; the amount and
// direction are dependent on the orientation of the two elements. 'seg', passed in to this method, tells you which segment the target element
// lies in with respect to the source: 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left.
//
// sourcePos and targetPos are arrays of info about where on the source and target each anchor is located.  their contents are:
//
// 0 - absolute x
// 1 - absolute y
// 2 - proportional x in element (0 is left edge, 1 is right edge)
// 3 - proportional y in element (0 is top edge, 1 is bottom edge)
//
_findControlPoint = function(midx, midy, segment, sourceEdge, targetEdge, dx, dy, distance, proximityLimit) {
    // TODO (maybe)
    // - if anchor pos is 0.5, make the control point take into account the relative position of the elements.
    if (distance <= proximityLimit) return [midx, midy];

    if (segment === 1) {
        if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
        else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
        else return [ midx + (-1 * dx) , midy + (-1 * dy) ];
    }
    else if (segment === 2) {
        if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
        else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
        else return [ midx + (1 * dx) , midy + (-1 * dy) ];
    }
    else if (segment === 3) {
        if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
        else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
        else return [ midx + (-1 * dx) , midy + (-1 * dy) ];
    }
    else if (segment === 4) {
        if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
        else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
        else return [ midx + (1 * dx) , midy + (-1 * dy) ];
    }

};

_segment = function(x1, y1, x2, y2) {
    if (x1 <= x2 && y2 <= y1) return 1;
    else if (x1 <= x2 && y1 <= y2) return 2;
    else if (x2 <= x1 && y2 >= y1) return 3;
    return 4;
};

calculateMiddleOfSide = function(element, side)
{
    var _tl = { x: getRelativePosition(element).x,  // top left
                y: getRelativePosition(element).y };
    var _tr = { x: element.offsetWidth + getRelativePosition(element).x, // top right
                y: getRelativePosition(element).y };
    var _bl = { x: getRelativePosition(element).x,  // bottom left
                y: element.offsetHeight + getRelativePosition(element).y };
    var _br = { x: element.offsetWidth + getRelativePosition(element).x,   // bottom right
                y: element.offsetHeight + getRelativePosition(element).y };

    if (side == "top") return { x: _tr.x - element.offsetWidth * 0.5, y: _tr.y };
    else if (side == "left") return { x: _tl.x, y: _bl.y - element.offsetHeight * 0.5 };
    else if (side == "right") return { x: _tr.x, y: _br.y - element.offsetHeight * 0.5 };
    else return { x: _br.x - element.offsetWidth * 0.5, y: _br.y };
};

findNearestSideToElement = function(sourceElement, targetElement) {
    return findNearestSide(
        { x: sourceElement.offsetWidth * 0.5 + getRelativePosition(sourceElement).x,    // center point
            y: sourceElement.offsetHeight * 0.5 + getRelativePosition(sourceElement).y },
        { x: getRelativePosition(targetElement).x,  // top left
            y: getRelativePosition(targetElement).y },
        { x: targetElement.offsetWidth + getRelativePosition(targetElement).x, // top right
            y: getRelativePosition(targetElement).y },
        { x: getRelativePosition(targetElement).x,  // bottom left
            y: targetElement.offsetHeight + getRelativePosition(targetElement).y },
        { x: targetElement.offsetWidth + getRelativePosition(targetElement).x,   // bottom right
            y: targetElement.offsetHeight + getRelativePosition(targetElement).y })
};

findNearestSide = function(_p, _tl, _tr, _bl, _br) {
    var _distanceToTop = pDistance(_p.x, _p.y, _tl.x, _tl.y, _tr.x, _tr.y);
    var _distanceToLeft = pDistance(_p.x, _p.y, _tl.x, _tl.y, _bl.x, _bl.y);
    var _distanceToRight = pDistance(_p.x, _p.y, _br.x, _br.y, _tr.x, _tr.y);
    var _distanceToBottom = pDistance(_p.x, _p.y, _bl.x, _bl.y, _br.x, _br.y);

    if (_distanceToTop <= _distanceToBottom && _distanceToTop <= _distanceToLeft && _distanceToTop <= _distanceToRight) return "top";
    else if (_distanceToLeft <= _distanceToRight && _distanceToLeft <= _distanceToBottom) return "left";
    else if (_distanceToRight <= _distanceToBottom) return "right";
    else return "bottom";
};

function pDistance(x, y, x1, y1, x2, y2) {

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = dot / len_sq;

    var xx, yy;

    if (param < 0 || (x1 == x2 && y1 == y2)) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

var _links = {};

function addLink(source, target, arrow)
{
    if (_links[source.id] == null) _links[source.id] = [];
    if (_links[target.id] == null) _links[target.id] = [];
    var link = {source: source, target: target, arrow: arrow};
    _links[source.id].push(link);
    _links[target.id].push(link);
}

function getLinks(source)
{
    return _links[source.id];
}

function removeLinks()
{
    for (var key in _links)
    {
        if (_links.hasOwnProperty(key))
        {
            _links[key][0].arrow.linePath.remove();
            _links[key][0].arrow.arrowPath.remove();
        }
    }

    _links = {};
}

var guid = (function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    };
})();