export function handleTwoDigitsFormat(time: string): string {
  const newTime = new Date(time);
  const hours = newTime.getHours();
  const minutes = newTime.getMinutes();

  return `${`0${String(hours)}`.slice(-2)}:${`0${String(minutes)}`.slice(-2)}`;
}

export function messageDateFormatter(createdAt: string): string {
  const today = new Date();

  const getCreatedAt = new Date(createdAt);
  const yesterdayMessage = getCreatedAt.setDate(getCreatedAt.getDate() + 1);

  // Check if message was sent today
  if (
    today.toLocaleDateString('pt-br') ===
    new Date(createdAt).toLocaleDateString('pt-br')
  ) {
    return handleTwoDigitsFormat(createdAt);
  }

  // Check if message was sent yesterday
  if (
    today.toLocaleDateString('pt-br') ===
    new Date(yesterdayMessage).toLocaleDateString('pt-br')
  ) {
    return 'ontem';
  }

  // Returns the complete date
  return new Date(createdAt).toLocaleDateString('pt-br');
}
