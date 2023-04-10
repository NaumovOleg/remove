import { CreativeLibraryFunctionConstruct, MediaPlanFunctionConstruct } from './resources/lambda';

export type ApiHandler = CreativeLibraryFunctionConstruct | MediaPlanFunctionConstruct;
