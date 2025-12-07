import React from "react";
import Svg, {
  Circle,
  G,
  Line,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
  Path,
} from "react-native-svg";

type Props = {
  width?: number;
  height?: number;
};

export function StreamCompassLogo({ width = 160, height = 160 }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512" fill="none">
      {/* Background circle */}
      <Circle cx={256} cy={256} r={256} fill="#020617" />

      {/* Outer ring */}
      <Circle
        cx={256}
        cy={256}
        r={210}
        fill="url(#ringGradient)"
        stroke="#0F172A"
        strokeWidth={10}
      />

      {/* Inner circle */}
      <Circle
        cx={256}
        cy={256}
        r={165}
        fill="#020617"
        stroke="#1D4ED8"
        strokeWidth={4}
        opacity={0.9}
      />

      {/* Cardinal ticks (N, E, S, W marks) */}
      <G stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" opacity={0.9}>
        {/* Top */}
        <Line x1={256} y1={78} x2={256} y2={108} />
        {/* Right */}
        <Line x1={434} y1={256} x2={404} y2={256} />
        {/* Bottom */}
        <Line x1={256} y1={434} x2={256} y2={404} />
        {/* Left */}
        <Line x1={78} y1={256} x2={108} y2={256} />
      </G>

      {/* Compass needle */}
      <G transform="translate(256 256) rotate(-18)">
        {/* North (primary) needle */}
        <Path
          d="M0 -150 L25 10 L0 40 L-25 10 Z"
          fill="url(#needleGradientPrimary)"
        />
        {/* South (secondary) needle */}
        <Path
          d="M0 150 L25 -10 L0 -40 L-25 -10 Z"
          fill="url(#needleGradientSecondary)"
          opacity={0.9}
        />
      </G>

      {/* Center dot */}
      <Circle cx={256} cy={256} r={10} fill="#E5F4FF" />

      {/* Light glow around center */}
      <Circle cx={256} cy={256} r={40} fill="#38BDF8" opacity={0.12} />

      {/* Gradients */}
      <Defs>
        <RadialGradient
          id="ringGradient"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(256 256) rotate(90) scale(210)"
        >
          <Stop offset="0" stopColor="#1D4ED8" />
          <Stop offset="0.5" stopColor="#0EA5E9" />
          <Stop offset="1" stopColor="#020617" />
        </RadialGradient>

        <LinearGradient
          id="needleGradientPrimary"
          x1={0}
          y1={-150}
          x2={0}
          y2={40}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#38BDF8" />
          <Stop offset="1" stopColor="#1D4ED8" />
        </LinearGradient>

        <LinearGradient
          id="needleGradientSecondary"
          x1={0}
          y1={150}
          x2={0}
          y2={-40}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#0B1120" />
          <Stop offset="1" stopColor="#1E40AF" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
