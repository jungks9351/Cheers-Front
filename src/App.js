import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import BoardWritePage from 'pages/BoardWritePage';
import BoardListPage from 'pages/BoardListPage';
import KakaoPage from 'pages/KakaoPage';
import RedirectPage from 'pages/RedirectPage';
import MainPage from 'pages/MainPage';

import MyPage from 'pages/MyPage';
import MyInfo from 'components/my/MyInfo';
import MyBoard from 'components/my/MyBoard';
import MyMeeting from 'components/my/MyMeeting';

import MeetingDetailPage from 'pages/MeetingDetailPage';
import MeetingPage from 'pages/MeetingPage';
import MeetingWritePage from 'pages/MeetingWritePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/board">
          <Route index element={<BoardListPage />} />
          <Route path="write" element={<BoardWritePage />} />
        </Route>
        <Route path="/meeting" element={<MeetingPage />} />
        <Route path="/meeting/:id" element={<MeetingDetailPage />} />
        <Route path="/meeting/write" element={<MeetingWritePage />} />
        <Route path="/oauth/kakao" element={<KakaoPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<MyInfo />} />
          <Route path="board" element={<MyBoard />} />
          <Route path="meeting" element={<MyMeeting />} />
        </Route>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
