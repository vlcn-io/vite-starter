/**
 * Note: modifying the schema currently requires:
 * 1. Restarting the server
 * 2. Refreshing the browser
 *
 * Other than that, DB migrations are automatically handled*
 *
 * *Note: the auto-migration path is still _beta_ quality.
 * Given that, you may need to reset your DB after certain schema changes.
 * You can disable auto-migration in production.
 */
export default {
  namespace: "default",
  name: "main",
  active: true,
  content: /*sql*/ `
    CREATE TABLE IF NOT EXISTS test (id PRIMARY KEY, name TEXT);
    SELECT crsql_as_crr('test');
  `,
};
