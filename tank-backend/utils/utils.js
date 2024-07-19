export function isCircRectCollision(cx, cy, radius, rectanglePoints) {
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
  let axes1 = getAxes(rect1);
  let axes2 = getAxes(rect2);
  let axes = axes1.concat(axes2);

  let minOverlap = Infinity;
  let smallestAxis = null;

  for (let axis of axes) {
    let proj1 = project(rect1, axis);
    let proj2 = project(rect2, axis);
    if (!isOverlapping(proj1, proj2)) {
      return;
    }

    const overlap = Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);
    if (overlap < minOverlap) {
      minOverlap = overlap;
      smallestAxis = axis;
    }
  }

  const rect1Center = getRectCenter(rect1);
  const rect2Center = getRectCenter(rect2);

  const direction = { x: rect1Center.x - rect2Center.x, y: rect1Center.y - rect2Center.y };
  smallestAxis = normalize(smallestAxis);

  if (dotProduct(direction, smallestAxis) < 0) {
    smallestAxis = { x: -smallestAxis.x, y: -smallestAxis.y };
  }

  return { x: smallestAxis.x * minOverlap, y: smallestAxis.y * minOverlap };
}

export function isCircLineCollision(cx, cy, radius, p1, p2) {
  let closest = closestPointOnSegment(cx, cy, p1.x, p1.y, p2.x, p2.y);
  let distanceSquared = (cx - closest.x) * (cx - closest.x) + (cy - closest.y) * (cy - closest.y);
  return distanceSquared <= radius * radius;
}

export function isRectLineCollision(rect, p1, p2) {
  let line = { x: p2.x - p1.x, y: p2.y - p1.y };
  let normal = { x: -line.y, y: line.x };

  let rectPoints = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];

  let proj1 = project(rectPoints, normal);
  let proj2 = project([p1, p2], normal);

  return isOverlapping(proj1, proj2);
}

export function getNormal(p1, p2) {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  let length = Math.hypot(dx, dy);
  return { x: -dy / length, y: dx / length };
}

export function closestPointOnSegment(px, py, ax, ay, bx, by) {
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

function distanceSquared(x1, y1, x2, y2) {
  return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
}

function getAxes(points) {
  const axis1 = { x: points[1].x - points[0].x, y: points[1].y - points[0].y };
  const axis2 = { x: points[2].x - points[1].x, y: points[2].y - points[1].y };
  return [axis1, axis2];
}

function dotProduct(v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

function project(points, axis) {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < points.length; i++) {
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

function normalize(v) {
  let length = Math.hypot(v.x, v.y);
  return { x: v.x / length, y: v.y / length };
}

function getRectCenter(rect) {
  let x = 0;
  let y = 0;
  for (let point of rect) {
    x += point.x;
    y += point.y;
  }
  return { x: x / 4, y: y / 4 };
}
