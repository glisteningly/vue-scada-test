const roundPathCorners = (pathPoints, radius) => {
  function moveTowardsLength(movingPoint, targetPoint, amount) {
    const width = (targetPoint.x - movingPoint.x)
    const height = (targetPoint.y - movingPoint.y)

    const distance = Math.sqrt(width * width + height * height)

    return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance))
  }

  function moveTowardsFractional(movingPoint, targetPoint, fraction) {
    return {
      x: movingPoint.x + (targetPoint.x - movingPoint.x) * fraction,
      y: movingPoint.y + (targetPoint.y - movingPoint.y) * fraction
    }
  }

  // Adjusts the ending position of a command
  // function adjustCommand(cmd, newPoint) {
  //   if (cmd.length > 2) {
  //     cmd[cmd.length - 2] = newPoint.x;
  //     cmd[cmd.length - 1] = newPoint.y;
  //   }
  // }
  // function adjustCommand(point, newPoint) {
  //   if (cmd.length > 2) {
  //     cmd[cmd.length - 2] = newPoint.x;
  //     cmd[cmd.length - 1] = newPoint.y;
  //   }
  // }

  // Gives an {x, y} object for a command's ending position
  function pointForCommand(cmd) {
    return {
      x: parseFloat(cmd[cmd.length - 2]),
      y: parseFloat(cmd[cmd.length - 1])
    }
  }

  // Split apart the path, handing concatonated letters and numbers
  // var pathParts = pathString
  //   .split(/[,\s]/)
  //   .reduce(function (parts, part) {
  //     var match = part.match("([a-zA-Z])(.+)");
  //     if (match) {
  //       parts.push(match[1]);
  //       parts.push(match[2]);
  //     } else {
  //       parts.push(part);
  //     }
  //     return parts;
  //   }, []);
  //
  // console.log(pathParts)

  // Group the commands with their arguments for easier handling
  // var commands = pathParts.reduce(function (commands, part) {
  //   if (parseFloat(part) == part && commands.length) {
  //     commands[commands.length - 1].push(part);
  //   } else {
  //     commands.push([part]);
  //   }
  //
  //   return commands;
  // }, []);


  //TODO:

  // The resulting commands, also grouped
  let resultCommands = []

  if (pathPoints.length > 1) {
    const startPoint = pathPoints[0]


    // We always use the first command (but it may be mutated)
    // resultCommands.push(commands[0]);
    resultCommands.push(['M', pathPoints[0].x, pathPoints[0].y])

    for (let cmdIndex = 1; cmdIndex < pathPoints.length; cmdIndex++) {
      const prevCmd = resultCommands[resultCommands.length - 1]

      const curPoint = pathPoints[cmdIndex]

      // Handle closing case
      const nextPoint = pathPoints[cmdIndex + 1]

      // Nasty logic to decide if this path is a candidite.
      if (curPoint && nextPoint && (prevCmd.length > 2)) {
        // Calc the points we're dealing with
        const prevPoint = pointForCommand(prevCmd)
        // var curPoint = pointForCommand(curCmd);
        // var nextPoint = pointForCommand(nextCmd);

        // The start and end of the cuve are just our point moved towards the previous and next points, respectivly
        // let curveStart, curveEnd;


        const curveStart = moveTowardsLength(curPoint, prevPoint, radius)
        const curveEnd = moveTowardsLength(curPoint, nextPoint, radius)


        // Adjust the current command and add it
        // adjustCommand(curCmd, curveStart);
        const curCmd = ['L', curveStart.x, curveStart.y]
        curCmd.origPoint = curPoint
        resultCommands.push(curCmd)

        // The curve control points are halfway between the start/end of the curve and
        // the original point
        const startControl = moveTowardsFractional(curveStart, curPoint, .5)
        const endControl = moveTowardsFractional(curPoint, curveEnd, .5)

        // Create the curve 
        const curveCmd = ["C", startControl.x, startControl.y, endControl.x, endControl.y, curveEnd.x, curveEnd.y];
        // Save the original point for fractional calculations
        curveCmd.origPoint = curPoint
        resultCommands.push(curveCmd)
      } else {
        // Pass through commands that don't qualify
        // resultCommands.push(curCmd)
        const curPoint = pathPoints[cmdIndex]
        const curCmd = ['L', curPoint.x, curPoint.y]
        // curCmd.origPoint = curPoint
        resultCommands.push(curCmd)
      }
    }

    // Fix up the starting point and restore the close path if the path was orignally closed
    // if (virtualCloseLine) {
    //   var newStartPoint = pointForCommand(resultCommands[resultCommands.length - 1]);
    //   resultCommands.push(["Z"]);
    //   adjustCommand(resultCommands[0], newStartPoint);
    // }
  } else {
    // resultCommands = commands;
  }


  const result = resultCommands.reduce(function (str, c) {
    return str + c.join(' ') + ' '
  }, '')

  // console.log(result)

  return result
}

export default roundPathCorners
//
// const pts = [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 100 }, { x: 150, y: 100 }, { x: 150, y: 50 },
//   { x: 200, y: 50 }]
//
// roundPathCorners(pts, 8)
