import { createSignal, createMemo } from "solid-js";
import _ from "lodash";

export enum TickOrientation {
  Rotated = 0,
  Standard = 1,
}

export type GaugeConfig = {
  arcs?: ArcConfig[],
  hands?: HandConfig[],
  ticks?: TickConfig[],
}

export type ArcConfig = {
  key: string,

  startValue?: number,
  endValue?: number,
  maxValue?: number

  inset?: number,
  width?: number | null,
  color?: string,

  on?: { [key in keyof GlobalEventHandlersEventMap]?: (this: Window, ev: WindowEventMap[key]) => any },
}

export type HandConfig = {
  key: string,

  value?: number,
  maxValue?: number,

  inset?: number,
  width?: number,
  color?: string,

  disableTransition?: boolean,
  transitionDurationMs?: number,
  transitionDelayMs?: number,
  transitionTimingFunction?: string;

  on?: { [key in keyof GlobalEventHandlersEventMap]?: (this: Window, ev: WindowEventMap[key]) => any },
}

export type TickConfig = {
  key: string,

  value?: number,
  maxValue?: number,

  offset?: number,

  label?: string,
  slot?: string,
  class?: string,
  fontSize?: number,
  color?: string,
  filter?: string,

  orientation?: TickOrientation,

  enableTransition?: boolean,
  transitionDurationMs?: number,
  transitionDelayMs?: number,
  transitionTimingFunction?: string;

  on?: { [key in keyof GlobalEventHandlersEventMap]?: (this: Window, ev: WindowEventMap[key]) => any },
}

const Gauge = (props) => {
  const [minValue] = createSignal(props.minValue ?? 0);
  const [maxValue] = createSignal(props.maxValue ?? 1);
  const [arcWidth] = createSignal(props.arcWidth ?? 100);
  const [arcColor] = createSignal(props.arcColor ?? 'red');
  const [handWidth] = createSignal(props.handWidth ?? 2);
  const [handColor] = createSignal(props.handColor ?? `rgba(0,0,0, 0.45)`);
  const [handInset] = createSignal(props.handInset ?? 10);
  const [handTransitionDurationMs] = createSignal(props.handTransitionDurationMs ?? 1000);
  const [handTransitionDelayMs] = createSignal(props.handTransitionDelayMs ?? 0);
  const [handTransitionTimingFunction] = createSignal(props.handTransitionTimingFunction ?? `ease`);
  const [handAnimationDuration] = createSignal(props.handAnimationDuration ?? 1);
  const [tickOrientation] = createSignal(props.tickOrientation ?? TickOrientation.Rotated);
  const [tickFontSize] = createSignal(props.tickFontSize ?? 10);
  const [tickColor] = createSignal(props.tickColor ?? 'black');
  const [tickTransitionDurationMs] = createSignal(props.tickTransitionDurationMs ?? 1000);
  const [tickTransitionDelayMs] = createSignal(props.tickTransitionDelayMs ?? 0);
  const [tickTransitionTimingFunction] = createSignal(props.tickTransitionTimingFunction ?? `ease`);
  const [tickAnimationDuration] = createSignal(props.tickAnimationDuration ?? 1);
  const [pie] = createSignal(props.pie ?? false);

  const maxViewBox = createMemo(() => 200);
  const viewBox = createMemo(() => pie() ? `0 0 ${maxViewBox()} ${maxViewBox()}` : `0 0 ${maxViewBox()} ${maxViewBox() / 2}`);
  const startAngle = createMemo(() => pie() ? 0 : -90);
  const endAngle = createMemo(() => pie() ? 359.99999 : 90);
  const centerX = createMemo(() => maxViewBox() / 2);
  const centerY = createMemo(() => maxViewBox() / 2);
  const angleRange = createMemo(() => endAngle() - startAngle());

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    const d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
  };

  const getArcD = (arc) => {
    const max = arc.maxValue ?? maxValue()

    const startPercent = _.clamp((arc.startValue ?? minValue()) / max, 0, 1);
    const endPercent = _.clamp((arc.endValue ?? maxValue()) / max, 0, 1);

    const startAngleVal = (startPercent * angleRange()) + startAngle();
    const endAngleVal = (endPercent * angleRange()) + startAngle();

    const radius = centerY() - (arc.inset ?? 0) - ((arc.width ?? arcWidth()) / 2);

    return describeArc(centerX(), centerY(), radius, startAngleVal, endAngleVal);
  };

  const getArcStyle = (arc) => {
    const style = {};

    style['stroke'] = arc.color ?? arcColor();

    if (arc.width == null)
      style['stroke-width'] = `${maxViewBox() / 2}`;
    else
      style['stroke-width'] = `${arc.width ?? arcWidth()}`;

    return style;
  };

  const getArcOn = (arc) => {
    return arc.on ?? {};
  };

  const getHandBind = (hand) => {
    return {
      x1: centerX(),
      y1: centerY(),
      x2: centerX(),
      y2: 0 + (hand.inset ?? handInset()),
    }
  };

  const getHandStyle = (hand) => {
    const style = {};

    style['stroke-width'] = hand.width ?? handWidth();
    style['stroke'] = hand.color ?? handColor();

    const max = hand.maxValue ?? maxValue()
    const percent = _.clamp((hand.value ?? minValue()) / max, 0, 1);
    const angle = (percent * angleRange()) + startAngle();
    style['transform'] = `rotate(${angle}deg)`;
    style['stroke-linecap'] = 'round';

    if (hand.disableTransition != true) {
      style['transition-duration'] = `${hand.transitionDurationMs ?? handTransitionDurationMs()}ms`;
      style['transition-delay'] = `${hand.transitionDelayMs ?? handTransitionDelayMs()}ms`;
      style['transition-timing-function'] = hand.transitionTimingFunction ?? handTransitionTimingFunction();
    }

    return style;
  };

  const getHandOn = (hand) => {
    return hand.on ?? {};
  };

  const getTickStyle = (tick) => {
    const style = {};

    const max = tick.maxValue ?? maxValue()
    const percent = _.clamp((tick.value ?? minValue()) / max, 0, 1)
    const angle = (percent * angleRange()) + startAngle();

    const radius = tick.offset ?? 0;

    const start = polarToCartesian(centerX(), centerY(), radius, angle);

    style['font-size'] = tick.fontSize ?? tickFontSize();
    style['fill'] = tick.color ?? tickColor();

    const transform = [];
    transform.push(`translate(${start.x}px, ${start.y}px)`);

    switch (tick.orientation ?? tickOrientation()) {
      case TickOrientation.Rotated:
        {
          const rotateDeg = (percent * angleRange()) + startAngle();
          transform.push(`rotate(${rotateDeg}deg)`);
        }
        break;
      case TickOrientation.Standard:
      default:
        break;
    }
    style['transform'] = transform.join(' ');

    if (tick.filter)
      style['filter'] = tick.filter;

    if (tick.enableTransition == true) {
      style['transition-duration'] = `${tick.transitionDurationMs ?? tickTransitionDurationMs()}ms`;
      style['transition-delay'] = `${tick.transitionDelayMs ?? tickTransitionDelayMs()}ms`;
      style['transition-timing-function'] = tick.transitionTimingFunction ?? tickTransitionTimingFunction();
    }

    return style;
  };

  const getTickSlot = (tick) => {
    return tick.slot ?? tick.key;
  };

  const getTickOn = (tick) => {
    return tick.on ?? {};
  };

  const localGetTickLabel = (tick) => {
    return tick.label;
  };

  return (
    <svg viewBox={viewBox()}>
      {props.arcs.map(arc => (
        <path
          key={arc.key}
          d={getArcD(arc)}
          style={getArcStyle(arc)}
          {...getArcOn(arc)}
        />
      ))}
      {props.hands.map(hand => (
        <line
          key={hand.key}
          {...getHandBind(hand)}
          style={getHandStyle(hand)}
          {...getHandOn(hand)}
        />
      ))}
      {props.ticks.map(tick => (
        <text
          key={tick.key}
          class={tick.class}
          style={getTickStyle(tick)}
          {...getTickOn(tick)}
        >
          {localGetTickLabel(tick)}
        </text>
      ))}
    </svg>
  );
};

export default Gauge;
