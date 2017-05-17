declare var __webpack_public_path__: string;

declare module '*.css' {
    const content: any;
    export default content;
}

declare type ComponentConstructor<TProps, TState> = new (...args: any[]) => React.Component<TProps, TState>;