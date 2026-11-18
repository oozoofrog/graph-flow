import assert from 'node:assert/strict';

export const paint = 'new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))';

export async function until(evaluate, expression) {
  const deadline = performance.now() + 30_000;
  do {
    if (await evaluate(expression)) return;
    await new Promise(resolve=>setTimeout(resolve, 50));
  } while (performance.now() < deadline);
  assert.fail('Dashboard did not reach: ' + expression);
}

export async function readPhoneCards(evaluate, step, message) {
  await evaluate('document.fonts.ready.then(()=>true)');
  await evaluate(`window.scrollTo(0,0); ${paint}`);
  const deadline = performance.now() + 30_000;
  let state;
  do {
    state = await evaluate(`(async()=>{
      const approval = document.querySelector('.plan-actions button.primary');
      const previous = scrollY;
      window.scrollTo(0, previous + ${step});
      // Allow the browser to deliver the scroll event before moving again.
      await (${paint});
      return {unlocked:!approval.disabled, moved:scrollY>previous,
        unread:[...document.querySelectorAll('#phone-flow .unread-mark')].map(mark=>mark.closest('.node-card').dataset.node)};
    })()`);
  } while (state.moved && performance.now() < deadline);
  assert(!state.moved && state.unlocked, message + ': ' + JSON.stringify(state));
}
