export interface Migration {
  up(): Promise<void>;
  down(): Promise<void>;
}

/**
 * User Defined Type Guard!
 * Virtually, this method can not filter appropriate class in the specific module under specified directory.
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * @param arg should be an instance of the class implemented interface Migration
 */
export function isMigration(arg: Migration): arg is Migration {
  // return true;
  // Guarantee the target class in the module has implement these two critical methods.
  return arg && arg.up !== undefined && arg.down !== undefined;
}
