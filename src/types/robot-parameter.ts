export interface RobotParameter {
    name: string,
    value: number | string,
    active?: boolean,
    min?: number,
    max?: number,
    step?: number,
}