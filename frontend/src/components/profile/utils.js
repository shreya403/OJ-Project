export const generateRandomData = () => {
    const data = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2023-12-31');
    const days = (endDate - startDate) / (1000 * 60 * 60 * 24);
  
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      data.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5),
      });
    }
  
    return data;
  };
  