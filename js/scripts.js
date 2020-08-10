// Custom scripts here
const moveTo = new MoveTo({easing: 'easeOutQuart'});

const trigger = document.getElementsByClassName('js-trigger')[0];
moveTo.registerTrigger(trigger);