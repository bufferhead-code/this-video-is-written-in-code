import { CanvasStyleSignal, canvasStyleSignal, Circle, Line, Node, NodeProps, PossibleCanvasStyle, signal, Txt } from '@motion-canvas/2d'
import {
  all,
  chain,
  Color,
  createRef,
  Reference,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
} from '@motion-canvas/core'

function pihedralProduct(n: number): number {
  if (n === 0) return 1
  return ((1 << n) - 1) * pihedralProduct(n - 1)
}

const span = pihedralProduct(4)
const step = 128

export type Tree = {
  data: number
  children: Tree[]
  ref?: Reference<Circle>
  edge?: Reference<Line>
}

export interface BinaryTreeProps extends NodeProps {
  fill: SignalValue<PossibleCanvasStyle>
  color: SignalValue<PossibleCanvasStyle>
  root: SignalValue<Tree>
}

export class BinaryTree extends Node {
  @signal()
  public declare readonly root: SimpleSignal<Tree, this>

  @canvasStyleSignal()
  public declare readonly fill: CanvasStyleSignal<this>

  @canvasStyleSignal()
  public declare readonly color: CanvasStyleSignal<this>

  constructor(props: BinaryTreeProps) {
    super(props)
  }

  *create(
    duration: number,
    tree: Tree = this.root(),
    x: number = 0,
    y: number = (-(this.getDepth(this.root()) - 1) * step) / 2,
    offset: number = span * ((1 << (this.getDepth(this.root()) - 2)) / ((1 << (this.getDepth(this.root()) - 1)) - 1)),
  ): ThreadGenerator {
    const c = createRef<Circle>()

    this.add(
      <Circle
        x={x}
        y={y}
        width={64}
        height={64}
        fill={this.fill()}
        zIndex={1}
        scale={0}
        ref={c}
      >
        <Txt
          fill={this.color()}
          fontFamily={'JetBrains Mono'}
          fontSize={32}
          text={tree.data.toString()}
        ></Txt>
      </Circle>
    )

    tree.ref = c

    yield* c().scale(1, duration)

    const dy = y + step
    if (tree.children[0]) {
      const dx = x - offset
      yield* chain(
        this.connect(x, y, dx, dy, duration, tree.children[0]),
        this.create(duration, tree.children[0], dx, dy, offset / 2),
      )
    }
    if (tree.children[1]) {
      const dx = x + offset
      yield* chain(
        this.connect(x, y, dx, dy, duration, tree.children[1]),
        this.create(duration, tree.children[1], dx, dy, offset / 2),
      )
    }
  }

  *destroy(duration: number, tree: Tree = this.root()): ThreadGenerator {
    for (const child of tree.children.reverse()) {
      yield* this.destroy(duration, child)
    }
    yield* tree.ref().scale(0, duration)
    if (tree.edge) yield* tree.edge().points([tree.edge().points()[0], tree.edge().points()[0]], duration)
  }

  *connect(x: number, y: number, dx: number, dy: number, duration: number, tree: Tree) {
    const l = createRef<Line>()
    this.add(
      <Line
        ref={l}
        points={[
          [x, y],
          [x, y],
        ]}
        stroke={this.fill()}
        lineWidth={8}
        lineCap={'round'}
      ></Line>
    )
    tree.edge = l
    yield* l().points(
      [
        [x, y],
        [dx, dy],
      ],
      duration
    )
  }

  *fadeFill(node: number, color: SignalValue<PossibleCanvasStyle>, duration: number) {
    yield* this.find(node, this.root()).ref().fill(color, duration)
  }

  find(node: number, tree: Tree): Tree {
    if (node < tree.data) {
      return this.find(node, tree.children[0])
    }
    if (node > tree.data) {
      return this.find(node, tree.children[1])
    }
    return tree
  }

  getDepth(tree: Tree): number {
    return Math.max(0, ...tree.children.map((child) => this.getDepth(child))) + 1
  }

  count(tree: Tree): number {
    return [0, ...tree.children.map((child) => this.count(child))].reduce((a, b) => a + b) + 1
  }
}