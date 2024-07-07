export function isCircRectCollision(cx, cy, radius, rectanglePoints) {
  function distanceSquared(x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
  }

  function closestPointOnSegment(px, py, ax, ay, bx, by) {
    let abx = bx - ax;
    let aby = by - ay;
    let apx = px - ax;
    let apy = py - ay;
    let ab2 = abx * abx + aby * aby;
    let ap_ab = apx * abx + apy * aby;
    let t = Math.min(1, Math.max(0, ap_ab / ab2));
    return {
      x: ax + t * abx,
      y: ay + t * aby,
    };
  }

  let closestDistanceSquared = Infinity;
  for (let i = 0; i < 4; i++) {
    let p1 = rectanglePoints[i];
    let p2 = rectanglePoints[(i + 1) % 4];
    let closest = closestPointOnSegment(cx, cy, p1.x, p1.y, p2.x, p2.y);
    let dSquared = distanceSquared(cx, cy, closest.x, closest.y);
    closestDistanceSquared = Math.min(closestDistanceSquared, dSquared);
  }

  return closestDistanceSquared <= radius * radius;
}

export function isRectRectCollision(rect1, rect2) {
  function getAxes(points) {
    let axes = [];
    for (let i = 0; i < points.length; i++) {
      let p1 = points[i];
      let p2 = points[(i + 1) % points.length];
      let edge = { x: p2.x - p1.x, y: p2.y - p1.y };
      let normal = { x: -edge.y, y: edge.x };
      axes.push(normal);
    }
    return axes;
  }

  function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  function project(points, axis) {
    let min = dotProduct(points[0], axis);
    let max = min;
    for (let i = 1; i < points.length; i++) {
      let projection = dotProduct(points[i], axis);
      if (projection < min) {
        min = projection;
      }
      if (projection > max) {
        max = projection;
      }
    }
    return { min, max };
  }

  function isOverlapping(proj1, proj2) {
    return proj1.max >= proj2.min && proj2.max >= proj1.min;
  }

  function doRectanglesOverlap(rect1, rect2) {
    let axes1 = getAxes(rect1);
    let axes2 = getAxes(rect2);
    let axes = axes1.concat(axes2);

    for (let axis of axes) {
      let proj1 = project(rect1, axis);
      let proj2 = project(rect2, axis);
      if (!isOverlapping(proj1, proj2)) {
        return false;
      }
    }
    return true;
  }

  return doRectanglesOverlap(rect1, rect2);
}
