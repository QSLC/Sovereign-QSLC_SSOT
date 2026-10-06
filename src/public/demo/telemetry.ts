export const TELEMETRY = [42, 68, 51, 84, 73, 92, 64, 88, 76, 96, 81, 90]

export const SYSTEM_NODES = [
  { id:'gateway', label:'Public Gateway', x:50, y:10, status:'online' },
  { id:'api', label:'API / Data Lab', x:18, y:38, status:'online' },
  { id:'learn', label:'Learning Studio', x:82, y:38, status:'online' },
  { id:'automation', label:'Automation Fabric', x:28, y:72, status:'online' },
  { id:'reporting', label:'Reporting', x:72, y:72, status:'online' },
  { id:'admin', label:'Protected Admin Boundary', x:50, y:93, status:'protected' },
] as const

export const SYSTEM_EDGES = [
  ['gateway','api'],['gateway','learn'],['api','automation'],['learn','reporting'],['automation','reporting'],['reporting','admin']
] as const
