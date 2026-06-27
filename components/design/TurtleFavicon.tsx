import * as React from 'react'

export type TurtleShellPattern =
  | 'plain'
  | 'ring'
  | 'segments'
  | 'spiral'
  | 'split'
  | 'wave'

export type TurtlePose = 'top' | 'side' | 'soft' | 'pixel' | 'swim' | 'shell'

export type TurtleFaviconVariant = {
  name: string
  slug: string
  shell: string
  body: string
  detail: string
  pattern: TurtleShellPattern
  pose?: TurtlePose
  tile?: string
  tileShape?: 'circle' | 'squircle'
  outlined?: boolean
  flipped?: boolean
}

function Tile({ variant }: { variant: TurtleFaviconVariant }) {
  if (!variant.tile) return null

  if (variant.tileShape === 'circle') {
    return <circle cx='32' cy='32' r='30' fill={variant.tile} />
  }

  return <rect x='3' y='3' width='58' height='58' rx='16' fill={variant.tile} />
}

function TopPattern({ variant }: { variant: TurtleFaviconVariant }) {
  const strokeProps = {
    fill: 'none',
    stroke: variant.detail,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  }

  switch (variant.pattern) {
    case 'ring':
      return (
        <ellipse
          cx='31'
          cy='32'
          rx='8'
          ry='10'
          {...strokeProps}
          strokeWidth='3'
        />
      )
    case 'segments':
      return (
        <path
          d='M31 17v30M17 32h28M21 22l20 20M41 22 21 42'
          {...strokeProps}
          strokeWidth='2.6'
        />
      )
    case 'spiral':
      return (
        <path
          d='M38 33c0 5-4 8-8 8-6 0-10-4-10-10 0-7 5-12 12-12 8 0 13 6 13 13'
          {...strokeProps}
          strokeWidth='3.2'
        />
      )
    case 'split':
      return <path d='M31 17v30M17 32h28' {...strokeProps} strokeWidth='3.2' />
    case 'wave':
      return (
        <path
          d='M18 27c5-5 9 5 14 0s9 5 13 0M18 36c5-5 9 5 14 0s9 5 13 0'
          {...strokeProps}
          strokeWidth='2.8'
        />
      )
    default:
      return null
  }
}

function TopTurtle({ variant }: { variant: TurtleFaviconVariant }) {
  const fill = variant.outlined ? 'none' : variant.body
  const stroke = variant.outlined ? variant.body : 'none'
  const shellFill = variant.outlined ? 'none' : variant.shell
  const shellStroke = variant.outlined ? variant.shell : 'none'

  return (
    <>
      <g
        fill={fill}
        stroke={stroke}
        strokeWidth={variant.outlined ? 3.5 : 0}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <ellipse cx='13' cy='20' rx='5.5' ry='4' transform='rotate(35 13 20)' />
        <ellipse
          cx='13'
          cy='44'
          rx='5.5'
          ry='4'
          transform='rotate(-35 13 44)'
        />
        <ellipse
          cx='45'
          cy='19'
          rx='5'
          ry='3.8'
          transform='rotate(-28 45 19)'
        />
        <ellipse cx='45' cy='45' rx='5' ry='3.8' transform='rotate(28 45 45)' />
        <path d='m13 32-8-5v10z' />
        <circle cx='52' cy='32' r='8' />
      </g>
      <ellipse
        cx='31'
        cy='32'
        rx='16'
        ry='19'
        fill={shellFill}
        stroke={shellStroke}
        strokeWidth={variant.outlined ? 4 : 0}
      />
      <TopPattern variant={variant} />
      <circle cx='54.5' cy='29.5' r='1.35' fill={variant.detail} />
    </>
  )
}

function SidePattern({ variant }: { variant: TurtleFaviconVariant }) {
  const common = {
    fill: 'none',
    stroke: variant.detail,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const
  }

  switch (variant.pattern) {
    case 'ring':
      return (
        <path
          d='M19 36c2-9 8-14 17-14 8 0 13 4 16 12'
          {...common}
          strokeWidth='3'
        />
      )
    case 'segments':
      return (
        <path
          d='m25 19-3 20M37 17l1 22M48 22l-3 17'
          {...common}
          strokeWidth='2.8'
        />
      )
    case 'spiral':
      return (
        <path
          d='M43 31c-1 5-5 8-10 7-6-1-9-5-8-10 1-6 6-9 12-8'
          {...common}
          strokeWidth='3'
        />
      )
    case 'split':
      return <path d='M18 33h34M34 17v22' {...common} strokeWidth='3' />
    case 'wave':
      return (
        <path
          d='M18 28c6-5 9 5 15 0s9 5 15 0M19 35c6-5 9 5 15 0s9 5 15 0'
          {...common}
          strokeWidth='2.6'
        />
      )
    default:
      return null
  }
}

function SideTurtle({ variant }: { variant: TurtleFaviconVariant }) {
  const fill = variant.outlined ? 'none' : variant.body
  const stroke = variant.outlined ? variant.body : 'none'
  const shellFill = variant.outlined ? 'none' : variant.shell
  const shellStroke = variant.outlined ? variant.shell : 'none'

  return (
    <>
      <g
        fill={fill}
        stroke={stroke}
        strokeWidth={variant.outlined ? 3.5 : 0}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='m16 36-10-5 5 10z' />
        <path d='M43 34h9a8 8 0 1 1 0 11H40z' />
        <path d='M18 38h9l-3 12h-9zM36 38h9l5 12H39z' />
      </g>
      <path
        d='M11 38c2-15 12-23 27-23 11 0 19 8 21 23z'
        fill={shellFill}
        stroke={shellStroke}
        strokeWidth={variant.outlined ? 4 : 0}
        strokeLinejoin='round'
      />
      <SidePattern variant={variant} />
      <circle cx='56' cy='38' r='1.35' fill={variant.detail} />
    </>
  )
}

function SoftTurtle({ variant }: { variant: TurtleFaviconVariant }) {
  return (
    <>
      <path
        d='M6 39c5-3 8-14 18-19 12-6 27-1 30 10 6 0 9 3 9 7 0 5-4 8-9 8-3 0-5-1-7-3l-2 8h-8l-1-7H23l-3 7h-8l2-9c-4 0-6 0-8-2Z'
        fill={variant.shell}
      />
      <path
        d='M18 36c4-8 10-12 19-12 6 0 11 2 15 6'
        fill='none'
        stroke={variant.detail}
        strokeWidth='3'
        strokeLinecap='round'
      />
      <circle cx='56' cy='35' r='1.35' fill={variant.detail} />
    </>
  )
}

function PixelTurtle({ variant }: { variant: TurtleFaviconVariant }) {
  return (
    <g fill={variant.shell}>
      <rect x='13' y='21' width='34' height='26' rx='5' />
      <rect x='47' y='29' width='11' height='11' rx='3' fill={variant.body} />
      <rect x='9' y='25' width='7' height='7' rx='2' fill={variant.body} />
      <rect x='17' y='16' width='8' height='8' rx='2' fill={variant.body} />
      <rect x='36' y='16' width='8' height='8' rx='2' fill={variant.body} />
      <rect x='17' y='44' width='8' height='8' rx='2' fill={variant.body} />
      <rect x='36' y='44' width='8' height='8' rx='2' fill={variant.body} />
      <path d='M30 21v26M13 34h34' stroke={variant.detail} strokeWidth='3' />
      <rect x='53' y='32' width='2' height='2' rx='1' fill={variant.detail} />
    </g>
  )
}

function SwimTurtle({ variant }: { variant: TurtleFaviconVariant }) {
  return (
    <>
      <path
        d='M10 34c3-12 13-19 25-19 9 0 16 4 20 11 5-1 8 2 8 6 0 5-4 8-9 8-4 0-6-2-8-5-3 7-9 11-17 11-10 0-17-5-19-12Z'
        fill={variant.shell}
      />
      <path d='M16 41 7 53l15-5M39 44l7 11 6-15' fill={variant.body} />
      {variant.pattern === 'wave' && (
        <path
          d='M18 29c5-5 9 5 14 0s9 5 14 0'
          fill='none'
          stroke={variant.detail}
          strokeWidth='3'
          strokeLinecap='round'
        />
      )}
      {variant.pattern === 'ring' && (
        <path
          d='M19 34c3-8 9-12 17-12 6 0 11 2 15 7'
          fill='none'
          stroke={variant.detail}
          strokeWidth='3'
          strokeLinecap='round'
        />
      )}
      <circle cx='56' cy='29.5' r='1.35' fill={variant.detail} />
    </>
  )
}

function ShellTurtle({ variant }: { variant: TurtleFaviconVariant }) {
  return (
    <>
      <ellipse cx='30' cy='33' rx='21' ry='18' fill={variant.shell} />
      <circle cx='53' cy='34' r='8' fill={variant.body} />
      <path
        d='m11 33-7-5v10zM17 45l-4 10h9l4-8M39 47l4 8h9l-5-11'
        fill={variant.body}
      />
      {(variant.pattern === 'ring' || variant.pattern === 'spiral') && (
        <ellipse
          cx='30'
          cy='33'
          rx='11'
          ry='9'
          fill='none'
          stroke={variant.detail}
          strokeWidth='3'
        />
      )}
      {variant.pattern === 'split' && (
        <path d='M30 15v36M9 33h42' stroke={variant.detail} strokeWidth='3' />
      )}
      <circle cx='55' cy='31.5' r='1.35' fill={variant.detail} />
    </>
  )
}

export function TurtleFavicon({
  variant,
  size = 64,
  id,
  className,
  title
}: {
  variant: TurtleFaviconVariant
  size?: number
  id?: string
  className?: string
  title?: string
}) {
  const pose = variant.pose || 'top'

  return (
    <svg
      id={id}
      className={className}
      width={size}
      height={size}
      viewBox='0 0 64 64'
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      xmlns='http://www.w3.org/2000/svg'
    >
      <Tile variant={variant} />
      <g
        transform={variant.flipped ? 'translate(64 0) scale(-1 1)' : undefined}
      >
        {pose === 'top' && <TopTurtle variant={variant} />}
        {pose === 'side' && <SideTurtle variant={variant} />}
        {pose === 'soft' && <SoftTurtle variant={variant} />}
        {pose === 'pixel' && <PixelTurtle variant={variant} />}
        {pose === 'swim' && <SwimTurtle variant={variant} />}
        {pose === 'shell' && <ShellTurtle variant={variant} />}
      </g>
    </svg>
  )
}
