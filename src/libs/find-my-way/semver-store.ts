import { max } from 'lodash-es'

class Node<T> {
  public prefix: number
  public children: Record<string, Node<T> | undefined>
  private childrenPrefixes: number[]
  public store: T | null

  public constructor(prefix?: string | number, children?: Record<string, Node<T> | undefined>, store?: T) {
    this.prefix = Number(prefix) || 0
    this.children = children ?? Object.create(null)
    this.childrenPrefixes =  children != null ? Object.keys(children).map(Number) : []
    this.store = store ?? null
  }

  public getChild (prefix: string | number) {
    if (this.children == null) {
      return null
    }

    if (prefix === 'x') {
      const maxChildrenPrefix = max(this.childrenPrefixes)
      if (maxChildrenPrefix == null) {
        return null
      } else {
        return this.children[maxChildrenPrefix] ?? null
      }
    }
  
    return this.children[prefix] ?? null
  }

  public addChild (node: Node<T>) {
    const child = this.getChild(node.prefix)

    if (child == null) {
      this.children[node.prefix] = node
      this.childrenPrefixes.push(node.prefix)
    }

    return child ?? node
  }
  
  public removeChild (prefix: string | number) {
    if (prefix === 'x') {
      this.children = Object.create(null)
      this.childrenPrefixes = []

      return this
    }

    if (this.children[prefix] != null) {
      const numbericPrefix = Number(prefix)

      if (Number.isNaN(numbericPrefix)) {
        return this
      }
      
      delete this.children[numbericPrefix]

      this.childrenPrefixes.splice(
        this.childrenPrefixes.indexOf(numbericPrefix),
        1
      )
    }

    return this
  }

  public setStore (store: T) {
    this.store = store

    return this
  }

  public get length() {
    return this.childrenPrefixes.length
  }
}

function parseVersion(version: string): { major: string; minor: string; patch: string; } {
  const v = version === '*' ? 'x.x.x' : version

  const firstDot = v.indexOf('.')
  const secondDot = v.indexOf('.', firstDot + 1)

  const major = v.slice(0, firstDot)
  const minor = secondDot === -1 ?
    v.slice(firstDot + 1) :
    v.slice(firstDot + 1, secondDot)
  const patch = secondDot === -1 ?
    'x' :
    v.slice(secondDot + 1)

  return {
    major,
    minor,
    patch
  }
}

export class SemVerStore<T> {
  private tree: Node<T>

  public constructor () {
    this.tree = new Node<T>()
  }

  public set(version: string, store: T) {
    let currentNode = this.tree

    const versionChunks = version.split('.')

    while (versionChunks.length) {
      currentNode = currentNode.addChild(
        new Node(versionChunks.shift())
      )
    }

    currentNode.setStore(store)

    return this
  }

  public get(version: string) {
    let node: Node<T> | null = this.tree

    const versionInfo = parseVersion(version)

    node = node.getChild(versionInfo.major)
    if (node == null) {
      return null
    }

    node = node.getChild(versionInfo.minor)
    if (node == null) {
      return null
    }

    node = node.getChild(versionInfo.patch)
    if (node == null) {
      return null
    }

    return node.store
  }

  public del (version: string) {
    const versionInfo = parseVersion(version)

    if (versionInfo.major === 'x') {
      this.tree = new Node()
      return this
    }

    const majorNode = this.tree.children[versionInfo.major]

    // check existence of major node
    if (majorNode == null) {
      return this
    }

    // if minor is the wildcard, then remove the full major node
    if (versionInfo.minor === 'x') {
      this.tree.removeChild(versionInfo.major)
      return this
    }


    const minorNode = majorNode.children[versionInfo.minor]

    // check existence of minor node
    if (minorNode == null) {
      return this
    }

    // if patch is the wildcard, then remove the full minor node
    // and also the major if there are no more children
    if (versionInfo.patch === 'x') {
      majorNode.removeChild(versionInfo.minor)
      if (majorNode.length === 0) {
        this.tree.removeChild(versionInfo.major)
      }
      return this
    }

    const patchNode = minorNode.children[versionInfo.patch]

    // check existence of patch node
    if (patchNode == null) {
      return this
    }

    minorNode.removeChild(versionInfo.patch)

    // check if the minor node has no more children, if so removes it
    // same for the major node
    if (minorNode.length === 0) {
      majorNode.removeChild(versionInfo.minor)
      if (majorNode.length === 0) {
        this.tree.removeChild(versionInfo.major)
      }
    }

    return this
  }

  public empty () {
    this.tree = new Node()
    return this
  }
}
