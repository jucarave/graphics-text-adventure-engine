import { Geometry } from './Geometry';
import { Material } from './Material';
import { Component } from './Component';
import { Vector3 } from '../maths/Vector3';
import { Matrix4 } from '../maths/Matrix4';

export class Entity {
  private components: Component[] = [];
  private initialized: boolean = false;
  private modelMatrix: Matrix4 = new Matrix4();
  private isDirty: boolean = true;

  public position: Vector3 = new Vector3();
  public rotation: number = 0;
  public geometry?: Geometry;
  public material?: Material;
  public markedForDestruction: boolean = false;

  constructor(geometry?: Geometry, material?: Material) {
    this.geometry = geometry;
    this.material = material;

    this.position.onChange.addListener(() => {
      this.isDirty = true;
    });
  }

  public addComponent(component: Component): void {
    this.components.push(component);

    if (this.initialized) {
      component.init();
    }
  }

  public removeComponent(component: Component): void {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      this.components.splice(index, 1);

      component.destroy();
    }
  }

  public init(): void {
    this.initialized = true;

    for (const component of this.components) {
      component.init();
    }
  }

  public update(deltaTime: number): void {
    for (const component of this.components) {
      component.update(deltaTime);
    }
  }

  public destroy(): void {
    for (const component of this.components) {
      component.destroy();
    }

    this.components = [];
  }

  public queueForDestruction(): void {
    this.markedForDestruction = true;
  }

  public render(): void {
    if (this.geometry && this.material) {
      this.material.render(this.geometry, this.getModelMatrix());
    }
  }

  public getModelMatrix(): Matrix4 {
    if (this.isDirty) {
      this.modelMatrix.setIdentity()
        .rotateZ(this.rotation)
        .translate(this.position.x, this.position.y, this.position.z);

      this.isDirty = false;
    }

    return this.modelMatrix;
  }

  public setRotation(rotation: number): void {
    if (this.rotation !== rotation) {
      this.rotation = rotation;
      this.isDirty = true;
    }
  }
}