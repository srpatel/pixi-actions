# pixi-actions

`pixi-actions` is an actions library for PixiJS that allows you to apply tweens and animations to display objects very easily. Simply, actions are a way to animate nodes without having to write a lot of boilerplate.

The easiest way to see what they do is to look at the [examples](#examples).

Note: in this document I will refer to DisplayObjects as _nodes_ for brevity.


## Usage

Install via npm:

	npm install pixi-actions

TypeScript type information are included, if you are using it. The library exports using ES6 modules.

You can then import the classes you need:

	import { Actions } from 'pixi-actions';
	import { Actions, Interpolations } from 'pixi-actions';

Register a ticker with your PIXI app:

	import { Actions } from 'pixi-actions';
	
	let app = new PIXI.Application({ ... });
	app.ticker.add((delta) => Actions.tick(delta/60));

Note that the delta supplied to the ticker function is in frames. If you want to use seconds instead (recommended), you should divide by your frames per second.

Then, you can create and play actions! Remember, creating an action is not enough - you must also call `.play()`, or the action will never start.

| Command | Details |
|:---|:---|
| `const action = Actions.moveTo(...)` | Create an action. See the table below for full details on how to do this. |
| `action.play();` | Start the action. It will continue to execute until it finishes or is paused. |
| `action.pause();` | Pause the action. It can be started again be calling `play()`. |
| `action.reset();` | Reset the action. It will re-apply its effect from the beginning. If you want to use an action which has completed, you must call `reset()` before calling `play()` again. Usually, it's simpler to just create a new action. |
| `action.stop();` | A shorthand for `action.reset(); action.pause();`. |
| `action.queue(anotherAction);` | Queue another action to be run once this one finishes. It may be simpler to use `Actions.sequence` instead (see below) if you know the action you want to queue at the point you create the action. |
| `Actions.clear(target);` | Remove all actions associated to a given target. |

See the table below for a full list of all the available actions.

## Actions

| Action | Details |
|:---|:---|
| `Actions.moveTo( target, x, y, time, interpolation ); ` | Animate a node to a specified position. |
| `Actions.scaleTo( target, x, y, time, interpolation ); ` | Animate a node's scale to specified values. |
| `Actions.rotateTo( target, rotation, time, interpolation ); ` | Animate a node's rotation to a specified value. Note that this uses the `rotation` property, which is in _radians_. There is an `angle` property which uses degrees, but there is no Action for it (yet!). |
| `Actions.fadeTo( target, alpha, time, interpolation ); ` | Animate a node's alpha to a specified value. |
| `Actions.fadeOut( target, time, interpolation ); ` | Animate a node's alpha to 0. |
| `Actions.fadeIn( target, time, interpolation ); ` | Animate a node's alpha to 1. |
| `Actions.fadeOutAndRemove( target, time, interpolation ); ` | Animate a node's alpha to 0, and remove it from its parent once invisible. |
| `Actions.remove( target ); ` | Remove a node from its parent. |
| `Actions.delay( time ); ` | Wait for a specified interval. |
| `Actions.runFunc( fn ); ` | Run a specified function. It will be called with the action itself as "this", which is probably not what you want. Take care, or use the ES6 "=>" notation to preserve the `this` of the caller. |
| `Actions.repeat( action, times = -1 ); ` | Repeat a specified action a given number of times. If `times` is negative, repeat indefinitely. |
| `Actions.sequence( ...actions ); ` | Perform the specified actions one after the other. |
| `Actions.parallel( ...actions ); ` | Perform the specified actions in parallel. This action won't finish until _all_ of its child actions have finished. |

Interpolation always defaults to pow2out if omitted. Time is in the same units supplied to `Actions.tick`.

## Examples

These examples all assume existence of a node `sprite` which has been added to the stage. For example, created by `const sprite = PIXI.Sprite.from(...);`.

<table>
	<thead>
		<tr>
			<th>Code</th>
			<th>Animation</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td><pre lang="json">
Actions.repeat(
	Actions.sequence(
		Actions.moveTo(sprite, 100, 0, 1, Interpolations.linear),
		Actions.moveTo(sprite, 100, 100, 1, Interpolations.linear),
		Actions.moveTo(sprite, 0, 100, 1, Interpolations.linear),
		Actions.moveTo(sprite, 0, 0, 1, Interpolations.linear)
	)
).play();</pre></td>
			<td><img alt="pixi-actions-example1" src="https://user-images.githubusercontent.com/4903502/111069490-95b8a400-84cd-11eb-86ea-790cd7d8598c.gif"></td>
		</tr>
		<tr>
			<td><pre lang="json">
Actions.repeat(
	Actions.sequence(
		Actions.parallel(
			Actions.moveTo(sprite, 100, 0, 1),
			Actions.fadeOut(sprite, 1)
		),
		Actions.moveTo(sprite, 100, 100, 0),
		Actions.parallel(
			Actions.moveTo(sprite, 0, 100, 1),
			Actions.fadeIn(sprite, 1)
		),
		Actions.moveTo(sprite, 0, 0, 0),
	)
).play();</pre></td>
			<td><img alt="pixi-actions-example2" src="https://user-images.githubusercontent.com/4903502/111069497-9bae8500-84cd-11eb-944c-d34d27502772.gif"><br><i>Please excuse the poor gif quality!</i></td>
		</tr>
	</tbody>
</table>

## Gotchas

Actions are automatically stopped if the target node has no parent. However, if you remove a more distant ancestor than the parent from the stage, then the action will not be stopped, and further, that action keeps a reference to the target. That means the target cannot be garbage collected whilst the action runs.

Normally, this is not a problem. Since most actions only last for a specified duration, the action will eventually stop (even though it'll have no visible impact whilst it runs) and both it and the node can then be garbage collected.

However, some actions can run indefinitely (e.g. `Actions.repeat`). In this case, you must either:

* Stop those actions whenever you remove the ancestor from the stage (with `action.stop()`).
* Remove the target node from its parent, even though you are removing an ancestor from the stage as well (`node.parent.removeChild(node);`).
* Clear all actions associated with the node (`Actions.clear(node);`).
