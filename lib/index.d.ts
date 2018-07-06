import './types';
declare type TagRule = string | RegExp | ((v: string) => boolean);
export declare const defaultTagRules: TagRule[];
export interface Options {
    recast?: any;
    tagRules?: TagRule[];
}
declare function loader(content: any, map: any, meta: any): any;
export default loader;
