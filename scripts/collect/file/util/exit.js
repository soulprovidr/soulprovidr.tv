/**
 * Exit the process when we encounter a fatal error.
 *
 * @param {Error} e
 */
function exit(e) {
  console.error(e);
  process.exit(1);
}

module.exports = exit;