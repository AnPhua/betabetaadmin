const staffctl = {
  id: 'utilities',
  title: 'Nhân Viên',
  type: 'group',
  children: [
    {
      id: 'myMovie',
      title: 'Phim',
      type: 'item',
      url: 'movie'
    },
    {
      id: 'myMovieType',
      title: 'Thể Loại Phim',
      type: 'item',
      url: 'movietype'
    },
    {
      id: 'mySchedule',
      title: 'Lịch Chiếu',
      type: 'item',
      url: 'schedule'
    }
  ]
};

export default staffctl;
