import React, { useEffect, useState } from 'react';
import { Box, Card, Stack, TextField } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PageTitleBox from '@/components/PageTitleBox';
import AddWidgetPopupButton from '@/pages/Dashboard/DashboardModify/AddWidgetPopupButton';
import ConfirmCancelButton, { ConfirmButton, CancelButton } from '@/components/button/ConfirmCancelButton';
import DialogAlertButton from '@/components/button/DialogAlertButton';
import GridLayout, { Responsive, WidthProvider } from 'react-grid-layout';

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { get } from '@/helpers/apiHelper';
import WidgetWrapper from '@/widget/wrapper/WidgetWrapper';

const ResponsiveGridLayout = WidthProvider(Responsive);

function DashboardModify(props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [dashboardId, setDashboardId] = useState(null); // dashboard id
  const [dashboardTitle, setDashboardTitle] = useState(''); // dashboard 제목
  const [widgets, setWidgets] = useState([]); // widget 정보
  const [layout, setLayout] = useState([]); // layout 정보
  const useWidgetIds = [];
  const dashboardInfo = {
    dashboardId: null,
    title: '',
    layout: [],
    widgets: [],
  };

  // init useEffect
  useEffect(() => {
    if (searchParams.get('id') != null) {
      setDashboardId(searchParams.get('id'));
      getDashboardInfo(searchParams.get('id'));
    }
  }, []);

  // dashboard info 조회
  const getDashboardInfo = id => {
    get('/data/dummyDashboardInfo.json').then(response => {
      setDashboardTitle(response.data.title);
      setWidgets(response.data.widgets);
      setLayout(response.data.layout);
    });
  };

  useEffect(() => {
    // 여기서 처리
    if (widgets.length > 0) {
      console.log(widgets);
    }
  }, [widgets]);

  // 현재 위젯 선택창에서 선택된 위젯 목록 callback
  const handleWidgetSelect = items => {
    // setSelectedWidgets(items);
    setWidgets([...widgets, ...items]);
  };

  // 레이아웃 변경 이벤트
  const onLayoutChange = changeLayout => {
    console.log('레이아웃이 바꼇어요');
    setLayout(changeLayout);
  };

  // widget 생성
  const generateWidget = () => {
    useWidgetIds.length = 0;
    const addLayouts = [];
    widgets.map((item, index) => {
      if (layout.length <= index) {
        addLayouts.push({
          x: 0,
          y: 0,
          w: 5,
          h: 5,
          i: item.widgetId,
        });
      }
    });

    if (addLayouts.length > 0) {
      setLayout([...layout, ...addLayouts]);
    }

    return widgets.map((item, index) => {
      useWidgetIds.push(item.widgetId); // 현재 widget id 를 담는다.
      return (
        <Card key={item.widgetId} sx={{ width: '100%', height: '100%', borderRadius: 1 }}>
          <span
            style={{ position: 'absolute', right: '2px', top: 0, cursor: 'pointer' }}
            onClick={() => {
              // 아이템 삭제
              console.log(item);
              const tempWidgets = [...widgets];
              const tempLayout = [...layout];
              const index = widgets.findIndex(widgetItem => widgetItem.widgetId == item.widgetId);
              console.log('index L: ', index);
              if (index > -1) {
                tempWidgets.splice(index, 1);
                tempLayout.splice(index, 1);

                setLayout([...tempLayout]);
                setWidgets([...tempWidgets]);
              }
            }}
          >
            X
          </span>
          <WidgetWrapper
            widgetOption={item}
            dataSetId={item.dataSetId}
            sx={{ width: '100%', height: '100%', borderRadius: 1 }}
          />
        </Card>
      );
    });
  };

  // 저장 여부 버튼 이벤트
  const handleSaveDialogSelect = detail => {
    if (detail == 1) {
      // validation 체크
      // title null 체크, widgets 수 체크 (0개면 저장 못함)
      // 저장 로직
      dashboardInfo.dashboardId = dashboardId;
      dashboardInfo.title = dashboardTitle;
      dashboardInfo.layout = layout;
      dashboardInfo.widgets = widgets;

      console.log('대시보드 저장');
      console.log(dashboardInfo);
    }
    console.log('저장한다 안한다', detail);
  };

  // 취소 여부 버튼 이벤트
  const handleCancelDialogSelect = detail => {
    if (detail == 1) {
      // 이전 페이지로 이동
      navigate(-1);
    }
  };

  return (
    <PageContainer>
      <PageTitleBox
        title="대시보드 편집"
        button={
          <React.Fragment>
            <ConfirmCancelButton
              // confirmProps={{ disabled: true }}
              confirmButton={
                <DialogAlertButton
                  cancelLabel="취소"
                  confirmLabel="저장"
                  handleDialogSelect={handleSaveDialogSelect}
                  button={<ConfirmButton confirmLabel="저장" cancelProps={{ component: 'div' }} />}
                >
                  저장하시겠습니까?
                </DialogAlertButton>
              }
              cancelButton={
                <DialogAlertButton
                  cancelLabel="취소"
                  confirmLabel="확인"
                  handleDialogSelect={handleCancelDialogSelect}
                  button={<CancelButton cancelLabel="취소" cancelProps={{ component: 'div' }} />}
                >
                  변경사항을 저장하지 않고 작업을 취소하시겠습니까?
                </DialogAlertButton>
              }
            />
          </React.Fragment>
        }
      >
        <Stack flexDirection="row" justifyContent="space-between" alignItems="baseline" mb={3}>
          <TextField
            id="userDashboardName"
            label=""
            required
            autoFocus
            sx={{ width: '50%' }}
            placeholder="대시보드의 이름을 입력해 주세요"
            value={dashboardTitle}
            onChange={event => {
              setDashboardTitle(event.target.value);
            }}
          />
          <AddWidgetPopupButton label="위젯 추가" widgetSelect={handleWidgetSelect} useWidgetIds={useWidgetIds} />
        </Stack>
        <Box
          sx={{
            width: '1440px',
            minHeight: '1080px',
            borderRadius: 1,
            backgroundColor: '#eee',
          }}
        >
          <ResponsiveGridLayout
            rowHeight={54}
            compactType={null}
            cols={{ lg: 12 }}
            layouts={{ lg: layout }}
            margin={[10, 10]}
            onLayoutChange={onLayoutChange}
          >
            {generateWidget()}
          </ResponsiveGridLayout>
        </Box>
      </PageTitleBox>
    </PageContainer>
  );
}

export default DashboardModify;
