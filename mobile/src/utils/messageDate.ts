function handleBeautifulTime(time: Date): string {
  return Intl.DateTimeFormat('pt-br', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(time);
}

export default function messageDate(createdAt: Date): string {
  const today = new Date();
  const yesterdayMessage = new Date().setDate(
    new Date(createdAt).getDate() + 1,
  );

  // Check if message was sent today
  if (
    today.toLocaleDateString('pt-br') ===
    new Date(createdAt).toLocaleDateString('pt-br')
  ) {
    return handleBeautifulTime(new Date(createdAt));
  }

  // Check if message was sent yesterday
  if (
    new Date(yesterdayMessage).toLocaleDateString('pt-br') ===
    new Date(createdAt).toLocaleDateString('pt-br')
  ) {
    return 'ontem';
  }

  // Returns the complete date
  return String(new Date(createdAt).toLocaleDateString('pt-br'));
}
