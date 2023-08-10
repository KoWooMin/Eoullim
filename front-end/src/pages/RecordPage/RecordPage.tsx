import { useState, useEffect } from 'react';
import RecordListItem from '../../components/record/RecordListItem';
import {
  RecordPageContainer,
  Passwordcofile,
  EmptyRecord,
  Scroll,
  BackIcon,
} from './RecordPageStyles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { tokenState } from '../../atoms/Auth';
import { useRecoilValue } from 'recoil';
import { API_BASE_URL } from '../../apis/urls';
import { Profilekey } from '../../atoms/Profile';

interface Record {
  animonName: string;
  create_time: string;
  record_id: number;
  school: string;
  video_path: string;
  name: string;
}

const RecordPage = () => {
  const [password, setPassword] = useState('');
  const token = useRecoilValue(tokenState);
  const profileId = useRecoilValue(Profilekey);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);

  const passwordClick = () => {
    axios
      .post(
        `${API_BASE_URL}/users/pw-check`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setIsPasswordCorrect(true);
      })
      .catch((error) => {
        alert('비밀번호를 확인해주세요.');
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      getRecord();
    }
  }, [profileId, token]);

  const getRecord = () => {
    axios
      .get(`https://i9c207.p.ssafy.io/api/openvidu/recordings/${profileId}`)
      .then((response) => {
        const data = response.data;
        console.log(response);
        setRecords(data);
        console.log('녹화영상 불러오기');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        } else {
          console.log('녹화영상불러오기오류', error);
        }
      });
  };

  const getBack = () => {
    navigate('/profile');
  };

  return (
    <RecordPageContainer>
      <BackIcon onClick={getBack}/>
      {isPasswordCorrect ? (
        records.length > 0 ? (
          <Scroll>
          {records.map((record) => (
            <RecordListItem
              key={record.record_id}
              name={record.name}
              animonName={record.animonName}
              school={record.school}
              video_path={record.video_path}
              create_time={record.create_time}
            />
          ))}
          </Scroll>
        ) : (
          <EmptyRecord />
        )
      ) : (
        <Passwordcofile>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={passwordClick}>확인</button>
        </Passwordcofile>
      )}
    </RecordPageContainer>
  );
};

export default RecordPage;
