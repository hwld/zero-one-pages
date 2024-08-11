export class ProjectExpansionMap {
  private map: Map<string, boolean> = new Map();

  public constructor(map?: ProjectExpansionMap) {
    this.map = new Map(map?.map);
  }

  public isExpanded(id: string) {
    return this.map.get(id) ?? true;
  }

  public toggle(id: string, isExpanded: boolean): ProjectExpansionMap {
    this.map.set(id, isExpanded);
    return this;
  }
}
