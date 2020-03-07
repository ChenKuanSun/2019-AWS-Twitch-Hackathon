export interface LabelResponse {
  LabelModelVersion: string;
  Labels: Label[];
}

export interface Label {
  Confidence: number;
  Instances: Instance[];
  Name: string;
  Parents: Parent[];
}

export interface Parent {
  Name: string;
}

export interface Instance {
  BoundingBox: BoundingBox;
  Confidence: number;
}

export interface BoundingBox {
  Height: number;
  Left: number;
  Top: number;
  Width: number;
}
