/**
 * 수도권 전철 실시간 노선도 (SMSS)
 * 1~8호선 모든 정차역 전수 등록 및 넉넉한 역간 간격(80~100px)과 
 * 상태별(진입/도착/출발) 실시간 열차 물리 위치 정밀 매핑
 */

// ==========================================
// 1. 수도권 지하철 1~8호선 전체 정차역 데이터베이스 (넓은 간격 배치)
// ==========================================
const METRO_NETWORK = {
    1: {
        num: 1,
        name: '1호선',
        color: '#0052A4',
        upName: '상행 (소요산 · 청량리 방면)',
        downName: '하행 (인천 · 신창 · 서울역 방면)',
        upTerminals: ['소요산', '동두천', '양주', '의정부', '광운대', '청량리'],
        downTerminals: ['인천', '신창', '천안', '서동탄', '구로', '서울역'],
        stations: [
            // 북부 구간 (연천 ~ 창동: Y 60px 간격 균등 배치)
            { name: '연천', x: 2250, y: 70, transfer: [] },
            { name: '전곡', x: 2250, y: 130, transfer: [] },
            { name: '청산', x: 2250, y: 190, transfer: [] },
            { name: '소요산', x: 2250, y: 250, transfer: [] },
            { name: '동두천', x: 2250, y: 310, transfer: [] },
            { name: '보산', x: 2250, y: 370, transfer: [] },
            { name: '동두천중앙', x: 2250, y: 430, transfer: [] },
            { name: '지행', x: 2250, y: 490, transfer: [] },
            { name: '덕정', x: 2250, y: 550, transfer: [] },
            { name: '덕계', x: 2250, y: 610, transfer: [] },
            { name: '양주', x: 2250, y: 670, transfer: [] },
            { name: '녹양', x: 2250, y: 730, transfer: [] },
            { name: '가능', x: 2250, y: 790, transfer: [] },
            { name: '의정부', x: 2250, y: 850, transfer: ['의정부경전철'] },
            { name: '회룡', x: 2250, y: 910, transfer: ['의정부경전철'] },
            { name: '망월사', x: 2250, y: 970, transfer: [] },
            { name: '도봉산', x: 2250, y: 1030, transfer: ['7'] },
            { name: '도봉', x: 2250, y: 1090, transfer: [] },
            { name: '방학', x: 2250, y: 1150, transfer: [] },
            { name: '창동', x: 2250, y: 1210, transfer: ['4'] },
            // 창동 ~ 청량리 곡선 구간 (약 75px 간격)
            { name: '녹천', x: 2220, y: 1280, transfer: [] },
            { name: '월계', x: 2185, y: 1350, transfer: [] },
            { name: '광운대', x: 2140, y: 1420, transfer: ['경춘'] },
            { name: '석계', x: 2085, y: 1485, transfer: ['6'] },
            { name: '신이문', x: 2020, y: 1545, transfer: [] },
            { name: '외대앞', x: 1950, y: 1600, transfer: [] },
            { name: '회기', x: 1870, y: 1640, transfer: ['경의중앙', '경춘'] },
            { name: '청량리', x: 1780, y: 1665, transfer: ['수인분당', '경의중앙', 'KTX'] },
            // 서울교통공사 도심 구간 (90px 여유 간격)
            { name: '제기동', x: 1690, y: 1680, transfer: [] },
            { name: '신설동', x: 1600, y: 1690, transfer: ['2', '우이신설'] },
            { name: '동묘앞', x: 1510, y: 1695, transfer: ['6'] },
            { name: '동대문', x: 1420, y: 1695, transfer: ['4'] },
            { name: '종로5가', x: 1330, y: 1695, transfer: [] },
            { name: '종로3가', x: 1240, y: 1695, transfer: ['3', '5'] },
            { name: '종각', x: 1150, y: 1695, transfer: [] },
            { name: '시청', x: 1060, y: 1715, transfer: ['2'] },
            { name: '서울역', x: 1060, y: 1805, transfer: ['4', '공항', '경의중앙', 'KTX'] },
            // 한강 남부 코레일 본선 (85px 간격)
            { name: '남영', x: 1060, y: 1890, transfer: [] },
            { name: '용산', x: 1060, y: 1975, transfer: ['경의중앙', 'KTX'] },
            { name: '노량진', x: 1005, y: 2050, transfer: ['9'] },
            { name: '대방', x: 935, y: 2115, transfer: ['신림선'] },
            { name: '신길', x: 860, y: 2165, transfer: ['5'] },
            { name: '영등포', x: 780, y: 2200, transfer: ['KTX'] },
            { name: '신도림', x: 695, y: 2225, transfer: ['2'] },
            { name: '구로', x: 605, y: 2245, transfer: [] },
            // 경인선 방면 서쪽 분기 (80px 간격)
            { name: '개봉', x: 525, y: 2245, transfer: [] },
            { name: '온수', x: 445, y: 2245, transfer: ['7'] },
            { name: '부천', x: 365, y: 2245, transfer: [] },
            { name: '송내', x: 290, y: 2245, transfer: [] },
            { name: '부평', x: 225, y: 2245, transfer: ['인천1'] },
            { name: '동암', x: 170, y: 2245, transfer: [] },
            { name: '주안', x: 120, y: 2245, transfer: ['인천2'] },
            { name: '동인천', x: 75, y: 2245, transfer: [] },
            { name: '인천', x: 35, y: 2245, transfer: ['수인분당'] },
            // 경부선 남부 방면 (80px 간격)
            { name: '가산디지털단지', x: 605, y: 2325, transfer: ['7'] },
            { name: '독산', x: 605, y: 2395, transfer: [] },
            { name: '금천구청', x: 605, y: 2465, transfer: [] },
            { name: '안양', x: 605, y: 2535, transfer: [] },
            { name: '명학', x: 605, y: 2605, transfer: [] },
            { name: '금정', x: 605, y: 2675, transfer: ['4'] },
            { name: '수원', x: 605, y: 2745, transfer: ['수인분당', 'KTX'] },
            { name: '평택', x: 605, y: 2815, transfer: [] },
            { name: '천안', x: 565, y: 2865, transfer: [] },
            { name: '신창', x: 485, y: 2875, transfer: [] }
        ]
    },
    2: {
        num: 2,
        name: '2호선',
        color: '#00A84D',
        upName: '내선순환 (시청 ➔ 을지로 ➔ 잠실 ➔ 강남)',
        downName: '외선순환 (시청 ➔ 홍대 ➔ 신도림 ➔ 사당)',
        upTerminals: ['성수', '을지로입구', '시청'],
        downTerminals: ['신도림', '홍대입구', '신설동'],
        stations: [
            // 북쪽 가로 구간 (시청 ~ 왕십리, 약 95px 간격)
            { name: '시청', x: 1060, y: 1715, transfer: ['1'] },
            { name: '을지로입구', x: 1155, y: 1735, transfer: [] },
            { name: '을지로3가', x: 1250, y: 1735, transfer: ['3'] },
            { name: '을지로4가', x: 1345, y: 1735, transfer: ['5'] },
            { name: 'DDP', x: 1440, y: 1745, transfer: ['4', '5'] },
            { name: '신당', x: 1535, y: 1745, transfer: ['6'] },
            { name: '상왕십리', x: 1625, y: 1745, transfer: [] },
            { name: '왕십리', x: 1715, y: 1745, transfer: ['5', '수인분당', '경의중앙'] },
            // 동쪽 세로 구간 (왕십리 ~ 잠실, 약 90px 간격)
            { name: '한양대', x: 1810, y: 1775, transfer: [] },
            { name: '뚝섬', x: 1895, y: 1820, transfer: [] },
            { name: '성수', x: 1975, y: 1875, transfer: [] },
            { name: '건대입구', x: 2045, y: 1945, transfer: ['7'] },
            { name: '구의', x: 2095, y: 2025, transfer: [] },
            { name: '강변', x: 2110, y: 2110, transfer: [] },
            { name: '잠실나루', x: 2095, y: 2195, transfer: [] },
            { name: '잠실', x: 2055, y: 2275, transfer: ['8'] },
            // 남쪽 가로 구간 (잠실 ~ 사당 ~ 신림, 약 95px 간격)
            { name: '잠실새내', x: 1980, y: 2335, transfer: [] },
            { name: '종합운동장', x: 1895, y: 2375, transfer: ['9'] },
            { name: '삼성', x: 1805, y: 2400, transfer: [] },
            { name: '선릉', x: 1715, y: 2400, transfer: ['수인분당'] },
            { name: '역삼', x: 1620, y: 2400, transfer: [] },
            { name: '강남', x: 1525, y: 2400, transfer: ['신분당'] },
            { name: '교대', x: 1420, y: 2400, transfer: ['3'] },
            { name: '서초', x: 1335, y: 2400, transfer: [] },
            { name: '방배', x: 1250, y: 2400, transfer: [] },
            { name: '사당', x: 1165, y: 2400, transfer: ['4'] },
            { name: '낙성대', x: 1080, y: 2400, transfer: [] },
            { name: '서울대입구', x: 995, y: 2400, transfer: [] },
            { name: '봉천', x: 915, y: 2400, transfer: [] },
            { name: '신림', x: 835, y: 2400, transfer: ['신림선'] },
            // 서쪽 세로 구간 (신림 ~ 당산 ~ 시청, 약 90px 간격)
            { name: '신대방', x: 760, y: 2355, transfer: [] },
            { name: '구로디지털단지', x: 705, y: 2295, transfer: [] },
            { name: '대림', x: 670, y: 2235, transfer: ['7'] },
            { name: '신도림', x: 695, y: 2225, transfer: ['1'] },
            { name: '문래', x: 685, y: 2135, transfer: [] },
            { name: '영등포구청', x: 695, y: 2050, transfer: ['5'] },
            { name: '당산', x: 725, y: 1965, transfer: ['9'] },
            { name: '합정', x: 775, y: 1885, transfer: ['6'] },
            { name: '홍대입구', x: 835, y: 1820, transfer: ['공항', '경의중앙'] },
            { name: '신촌', x: 895, y: 1775, transfer: [] },
            { name: '이대', x: 955, y: 1745, transfer: [] },
            { name: '아현', x: 995, y: 1730, transfer: [] },
            { name: '충정로', x: 1025, y: 1720, transfer: ['5'] }
        ]
    },
    3: {
        num: 3,
        name: '3호선',
        color: '#EF7C1C',
        upName: '상행 (대화 · 구파발 방면)',
        downName: '하행 (오금 · 수서 방면)',
        upTerminals: ['대화', '구파발', '독립문'],
        downTerminals: ['오금', '수서', '압구정'],
        stations: [
            { name: '대화', x: 450, y: 680, transfer: [] },
            { name: '주엽', x: 530, y: 760, transfer: [] },
            { name: '정발산', x: 610, y: 840, transfer: [] },
            { name: '마두', x: 690, y: 920, transfer: [] },
            { name: '백석', x: 770, y: 1000, transfer: [] },
            { name: '대곡', x: 850, y: 1080, transfer: ['경의중앙', '서해선'] },
            { name: '화정', x: 915, y: 1150, transfer: [] },
            { name: '원당', x: 975, y: 1210, transfer: [] },
            { name: '삼송', x: 1035, y: 1270, transfer: [] },
            { name: '구파발', x: 1095, y: 1330, transfer: [] },
            { name: '연신내', x: 1145, y: 1390, transfer: ['6'] },
            { name: '불광', x: 1175, y: 1450, transfer: ['6'] },
            { name: '녹번', x: 1195, y: 1510, transfer: [] },
            { name: '홍제', x: 1205, y: 1560, transfer: [] },
            { name: '독립문', x: 1215, y: 1610, transfer: [] },
            { name: '경복궁', x: 1230, y: 1650, transfer: [] },
            { name: '안국', x: 1235, y: 1675, transfer: [] },
            { name: '종로3가', x: 1240, y: 1695, transfer: ['1', '5'] },
            { name: '을지로3가', x: 1250, y: 1735, transfer: ['2'] },
            { name: '충무로', x: 1285, y: 1805, transfer: ['4'] },
            { name: '동대입구', x: 1335, y: 1875, transfer: [] },
            { name: '약수', x: 1385, y: 1945, transfer: ['6'] },
            { name: '금호', x: 1425, y: 2015, transfer: [] },
            { name: '옥수', x: 1465, y: 2085, transfer: ['경의중앙'] },
            { name: '압구정', x: 1505, y: 2155, transfer: [] },
            { name: '신사', x: 1475, y: 2235, transfer: ['신분당'] },
            { name: '잠원', x: 1420, y: 2295, transfer: [] },
            { name: '고속터미널', x: 1355, y: 2345, transfer: ['7', '9'] },
            { name: '교대', x: 1420, y: 2400, transfer: ['2'] },
            { name: '남부터미널', x: 1475, y: 2455, transfer: [] },
            { name: '양재', x: 1555, y: 2505, transfer: ['신분당'] },
            { name: '매봉', x: 1635, y: 2540, transfer: [] },
            { name: '도곡', x: 1715, y: 2555, transfer: ['수인분당'] },
            { name: '대치', x: 1795, y: 2565, transfer: [] },
            { name: '일원', x: 1875, y: 2565, transfer: [] },
            { name: '수서', x: 1965, y: 2555, transfer: ['수인분당', 'SRT'] },
            { name: '가락시장', x: 2060, y: 2530, transfer: ['8'] },
            { name: '경찰병원', x: 2150, y: 2500, transfer: [] },
            { name: '오금', x: 2240, y: 2470, transfer: ['5'] }
        ]
    },
    4: {
        num: 4,
        name: '4호선',
        color: '#00A5DE',
        upName: '상행 (진접 · 당고개 방면)',
        downName: '하행 (오이도 · 사당 방면)',
        upTerminals: ['진접', '당고개', '노원'],
        downTerminals: ['오이도', '안산', '금정', '사당'],
        stations: [
            { name: '진접', x: 2580, y: 230, transfer: [] },
            { name: '오남', x: 2510, y: 350, transfer: [] },
            { name: '별내별가람', x: 2440, y: 470, transfer: [] },
            { name: '당고개', x: 2370, y: 610, transfer: [] },
            { name: '상계', x: 2320, y: 710, transfer: [] },
            { name: '노원', x: 2285, y: 810, transfer: ['7'] },
            { name: '창동', x: 2250, y: 1210, transfer: ['1'] },
            { name: '쌍문', x: 2170, y: 1270, transfer: [] },
            { name: '수유', x: 2100, y: 1330, transfer: [] },
            { name: '미아', x: 2030, y: 1390, transfer: [] },
            { name: '미아사거리', x: 1960, y: 1450, transfer: [] },
            { name: '길음', x: 1890, y: 1500, transfer: [] },
            { name: '성신여대입구', x: 1820, y: 1550, transfer: ['우이신설'] },
            { name: '한성대입구', x: 1750, y: 1600, transfer: [] },
            { name: '혜화', x: 1695, y: 1630, transfer: [] },
            { name: '동대문', x: 1420, y: 1695, transfer: ['1'] },
            { name: 'DDP', x: 1440, y: 1745, transfer: ['2', '5'] },
            { name: '충무로', x: 1285, y: 1805, transfer: ['3'] },
            { name: '명동', x: 1180, y: 1805, transfer: [] },
            { name: '회현', x: 1115, y: 1805, transfer: [] },
            { name: '서울역', x: 1060, y: 1805, transfer: ['1', '공항', '경의중앙', 'KTX'] },
            { name: '숙대입구', x: 1080, y: 1895, transfer: [] },
            { name: '삼각지', x: 1090, y: 1980, transfer: ['6'] },
            { name: '신용산', x: 1090, y: 2055, transfer: [] },
            { name: '이촌', x: 1090, y: 2130, transfer: ['경의중앙'] },
            { name: '동작', x: 1090, y: 2220, transfer: ['9'] },
            { name: '총신대입구', x: 1115, y: 2315, transfer: ['7'] },
            { name: '사당', x: 1165, y: 2400, transfer: ['2'] },
            { name: '남태령', x: 1145, y: 2475, transfer: [] },
            { name: '과천', x: 1115, y: 2545, transfer: [] },
            { name: '인덕원', x: 1085, y: 2615, transfer: [] },
            { name: '금정', x: 605, y: 2675, transfer: ['1'] },
            { name: '산본', x: 520, y: 2675, transfer: [] },
            { name: '상록수', x: 425, y: 2675, transfer: [] },
            { name: '중앙', x: 335, y: 2675, transfer: ['수인분당'] },
            { name: '안산', x: 245, y: 2675, transfer: ['수인분당'] },
            { name: '오이도', x: 145, y: 2675, transfer: ['수인분당'] }
        ]
    },
    5: {
        num: 5,
        name: '5호선',
        color: '#996CAC',
        upName: '상행 (방화 · 여의도 방면)',
        downName: '하행 (하남검단산 · 마천 방면)',
        upTerminals: ['방화', '화곡', '여의도'],
        downTerminals: ['하남검단산', '마천', '강동'],
        stations: [
            { name: '방화', x: 200, y: 1690, transfer: [] },
            { name: '김포공항', x: 300, y: 1765, transfer: ['9', '공항'] },
            { name: '화곡', x: 430, y: 1875, transfer: [] },
            { name: '목동', x: 575, y: 1950, transfer: [] },
            { name: '영등포구청', x: 695, y: 2050, transfer: ['2'] },
            { name: '여의도', x: 780, y: 2095, transfer: ['9'] },
            { name: '마포', x: 870, y: 1980, transfer: [] },
            { name: '공덕', x: 935, y: 1885, transfer: ['6', '공항', '경의중앙'] },
            { name: '충정로', x: 1025, y: 1720, transfer: ['2'] },
            { name: '서대문', x: 1115, y: 1705, transfer: [] },
            { name: '광화문', x: 1165, y: 1700, transfer: [] },
            { name: '종로3가', x: 1240, y: 1695, transfer: ['1', '3'] },
            { name: '을지로4가', x: 1345, y: 1735, transfer: ['2'] },
            { name: 'DDP', x: 1440, y: 1745, transfer: ['2', '4'] },
            { name: '청구', x: 1555, y: 1805, transfer: ['6'] },
            { name: '왕십리', x: 1715, y: 1745, transfer: ['2', '수인분당', '경의중앙'] },
            { name: '군자', x: 2025, y: 1745, transfer: ['7'] },
            { name: '아차산', x: 2115, y: 1775, transfer: [] },
            { name: '광나루', x: 2205, y: 1810, transfer: [] },
            { name: '천호', x: 2295, y: 1865, transfer: ['8'] },
            { name: '강동', x: 2385, y: 1920, transfer: [] },
            { name: '명일', x: 2475, y: 1975, transfer: [] },
            { name: '하남검단산', x: 2625, y: 2065, transfer: [] }
        ]
    },
    6: {
        num: 6,
        name: '6호선',
        color: '#CD7C2F',
        upName: '상행 (응암순환 · 마포구청 방면)',
        downName: '하행 (신내 · 석계 방면)',
        upTerminals: ['응암', 'DMC'],
        downTerminals: ['신내', '봉화산', '안암'],
        stations: [
            { name: '응암', x: 740, y: 1350, transfer: [] },
            { name: '연신내', x: 1145, y: 1390, transfer: ['3'] },
            { name: '불광', x: 1175, y: 1450, transfer: ['3'] },
            { name: 'DMC', x: 775, y: 1680, transfer: ['공항', '경의중앙'] },
            { name: '마포구청', x: 805, y: 1775, transfer: [] },
            { name: '망원', x: 825, y: 1835, transfer: [] },
            { name: '합정', x: 775, y: 1885, transfer: ['2'] },
            { name: '상수', x: 835, y: 1895, transfer: [] },
            { name: '공덕', x: 935, y: 1885, transfer: ['5', '공항', '경의중앙'] },
            { name: '효창공원앞', x: 990, y: 1930, transfer: ['경의중앙'] },
            { name: '삼각지', x: 1090, y: 1980, transfer: ['4'] },
            { name: '이태원', x: 1200, y: 1995, transfer: [] },
            { name: '한강진', x: 1280, y: 1995, transfer: [] },
            { name: '버티고개', x: 1335, y: 1985, transfer: [] },
            { name: '약수', x: 1385, y: 1945, transfer: ['3'] },
            { name: '청구', x: 1555, y: 1805, transfer: ['5'] },
            { name: '신당', x: 1535, y: 1745, transfer: ['2'] },
            { name: '동묘앞', x: 1510, y: 1695, transfer: ['1'] },
            { name: '안암', x: 1635, y: 1625, transfer: [] },
            { name: '고려대', x: 1725, y: 1570, transfer: [] },
            { name: '월곡', x: 1815, y: 1535, transfer: [] },
            { name: '석계', x: 2085, y: 1485, transfer: ['1'] },
            { name: '태릉입구', x: 2185, y: 1450, transfer: ['7'] },
            { name: '봉화산', x: 2280, y: 1430, transfer: [] },
            { name: '신내', x: 2385, y: 1430, transfer: ['경춘'] }
        ]
    },
    7: {
        num: 7,
        name: '7호선',
        color: '#747F00',
        upName: '상행 (장암 · 도봉산 방면)',
        downName: '하행 (석남 · 온수 방면)',
        upTerminals: ['장암', '도봉산', '수락산'],
        downTerminals: ['석남', '부평구청', '온수'],
        stations: [
            { name: '장암', x: 2310, y: 940, transfer: [] },
            { name: '도봉산', x: 2250, y: 1030, transfer: ['1'] },
            { name: '수락산', x: 2270, y: 1090, transfer: [] },
            { name: '노원', x: 2285, y: 810, transfer: ['4'] },
            { name: '중계', x: 2295, y: 1220, transfer: [] },
            { name: '하계', x: 2295, y: 1300, transfer: [] },
            { name: '태릉입구', x: 2185, y: 1450, transfer: ['6'] },
            { name: '상봉', x: 2200, y: 1580, transfer: ['경의중앙', '경춘'] },
            { name: '면목', x: 2220, y: 1675, transfer: [] },
            { name: '군자', x: 2025, y: 1745, transfer: ['5'] },
            { name: '건대입구', x: 2045, y: 1945, transfer: ['2'] },
            { name: '청담', x: 1910, y: 2110, transfer: [] },
            { name: '강남구청', x: 1800, y: 2205, transfer: ['수인분당'] },
            { name: '논현', x: 1650, y: 2280, transfer: ['신분당'] },
            { name: '고속터미널', x: 1355, y: 2345, transfer: ['3', '9'] },
            { name: '내방', x: 1245, y: 2320, transfer: [] },
            { name: '총신대입구', x: 1115, y: 2315, transfer: ['4'] },
            { name: '숭실대입구', x: 980, y: 2295, transfer: [] },
            { name: '보라매', x: 810, y: 2275, transfer: ['신림선'] },
            { name: '대림', x: 670, y: 2235, transfer: ['2'] },
            { name: '가산디지털단지', x: 605, y: 2325, transfer: ['1'] },
            { name: '온수', x: 445, y: 2245, transfer: ['1'] },
            { name: '부천시청', x: 305, y: 2295, transfer: [] },
            { name: '부평구청', x: 180, y: 2295, transfer: ['인천1'] },
            { name: '석남', x: 70, y: 2295, transfer: ['인천2'] }
        ]
    },
    8: {
        num: 8,
        name: '8호선',
        color: '#E6186C',
        upName: '상행 (별내 · 암사 방면)',
        downName: '하행 (모란 · 복정 방면)',
        upTerminals: ['별내', '암사'],
        downTerminals: ['모란', '복정'],
        stations: [
            { name: '별내', x: 2420, y: 1360, transfer: ['경춘'] },
            { name: '동구릉', x: 2405, y: 1490, transfer: [] },
            { name: '구리', x: 2385, y: 1610, transfer: ['경의중앙'] },
            { name: '암사역사공원', x: 2350, y: 1720, transfer: [] },
            { name: '암사', x: 2330, y: 1810, transfer: [] },
            { name: '천호', x: 2295, y: 1865, transfer: ['5'] },
            { name: '강동구청', x: 2245, y: 1980, transfer: [] },
            { name: '몽촌토성', x: 2170, y: 2095, transfer: [] },
            { name: '잠실', x: 2055, y: 2275, transfer: ['2'] },
            { name: '석촌', x: 2060, y: 2375, transfer: ['9'] },
            { name: '송파', x: 2070, y: 2465, transfer: [] },
            { name: '가락시장', x: 2060, y: 2530, transfer: ['3'] },
            { name: '문정', x: 2060, y: 2605, transfer: [] },
            { name: '복정', x: 2060, y: 2670, transfer: ['수인분당'] },
            { name: '모란', x: 2060, y: 2730, transfer: ['수인분당'] }
        ]
    }
};

// ==========================================
// 2. 전역 상태 변수
// ==========================================
let currentLine = 1; // 기본 1호선 선택
let allTrains = {};  // 실시간 열차 목록
let refreshCountdown = 10;
let refreshTimerId = null;

// Zoom & Pan 상태 변수
let zoomLevel = 1.0;
let panX = 0;
let panY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;

// DOM 캐시
const lineTabs = document.querySelectorAll('.line-tab');
const bannerBadge = document.getElementById('banner-badge');
const bannerTitle = document.getElementById('banner-title');
const bannerSub = document.getElementById('banner-sub');
const totalTrainCount = document.getElementById('total-train-count');
const upTrainCount = document.getElementById('up-train-count');
const downTrainCount = document.getElementById('down-train-count');
const panelLineTitle = document.getElementById('panel-line-title');
const activeLineTrack = document.getElementById('active-line-track');
const stationSearchInput = document.getElementById('station-search');
const btnSearchClear = document.getElementById('btn-search-clear');
const refreshTimerText = document.getElementById('refresh-timer');
const btnManualRefresh = document.getElementById('btn-manual-refresh');

// 줌 컨트롤 버튼
const btnZoomIn = document.getElementById('btn-zoom-in');
const btnZoomOut = document.getElementById('btn-zoom-out');
const btnZoomReset = document.getElementById('btn-zoom-reset');
const svgMapWrapper = document.getElementById('svg-map-wrapper');
const svgRootLayer = document.getElementById('svg-root-layer');
const svgLinesLayer = document.getElementById('svg-lines-layer');
const svgStationsLayer = document.getElementById('svg-stations-layer');
const svgTrainsLayer = document.getElementById('svg-trains-layer');
const svgLabelsLayer = document.getElementById('svg-labels-layer');
const svgGridLayer = document.getElementById('svg-grid-layer');

// 모달
const trainModal = document.getElementById('train-modal');
const modalTrainType = document.getElementById('modal-train-type');
const modalTrainTitle = document.getElementById('modal-train-title');
const modalDestination = document.getElementById('modal-destination');
const modalCurrStation = document.getElementById('modal-curr-station');
const modalDirection = document.getElementById('modal-direction');
const modalStatusText = document.getElementById('modal-status-text');
const congestionCars = document.getElementById('congestion-cars');
const modalCloseBtn = document.getElementById('modal-close-btn');

const stationModal = document.getElementById('station-modal');
const stModalLine = document.getElementById('st-modal-line');
const stModalName = document.getElementById('st-modal-name');
const stUpList = document.getElementById('st-up-list');
const stDownList = document.getElementById('st-down-list');
const stModalCloseBtn = document.getElementById('st-modal-close-btn');

// ==========================================
// 3. 실시간 열차 시뮬레이션 데이터 생성
// ==========================================
function initSimulationTrains() {
    allTrains = {};
    Object.keys(METRO_NETWORK).forEach(lineNum => {
        const line = METRO_NETWORK[lineNum];
        const trainList = [];
        const count = Math.min(18, Math.max(8, Math.floor(line.stations.length / 3)));

        for (let i = 0; i < count; i++) {
            const dir = i % 2 === 0 ? 'up' : 'down';
            const terminals = dir === 'up' ? line.upTerminals : line.downTerminals;
            const dest = terminals[Math.floor(Math.random() * terminals.length)];
            const isExpress = Math.random() < 0.25;
            const trainNo = `${isExpress ? 'K' : (Math.random() < 0.5 ? 'S' : '')}${line.num * 1000 + i * 24 + Math.floor(Math.random() * 9)}`;
            const step = Math.floor(line.stations.length / count);
            const stationIndex = Math.min(line.stations.length - 1, Math.max(0, Math.floor(i * step + (Math.random() * 2 - 1))));

            trainList.push({
                id: `T_${lineNum}_${trainNo}`,
                lineNum: parseInt(lineNum, 10),
                trainNo,
                dest: `${dest}행`,
                type: isExpress ? '급행' : '일반',
                direction: dir,
                stationIndex,
                state: Math.random() < 0.35 ? 'enter' : (Math.random() < 0.7 ? 'arrive' : 'depart'),
                isDelayed: Math.random() < 0.1,
                congestion: Array.from({ length: 10 }, () => {
                    const r = Math.random();
                    if (r < 0.35) return { level: 'smooth', rate: Math.floor(Math.random() * 25) + 15 };
                    if (r < 0.75) return { level: 'normal', rate: Math.floor(Math.random() * 30) + 38 };
                    return { level: 'crowded', rate: Math.floor(Math.random() * 25) + 72 };
                })
            });
        }
        allTrains[lineNum] = trainList;
    });
}

function advanceAllTrains() {
    Object.keys(allTrains).forEach(lineNum => {
        const line = METRO_NETWORK[lineNum];
        const trains = allTrains[lineNum];
        const total = line.stations.length;

        trains.forEach(t => {
            if (t.state === 'enter') {
                t.state = 'arrive';
            } else if (t.state === 'arrive') {
                t.state = 'depart';
            } else {
                t.state = 'enter';
                if (t.direction === 'up') {
                    t.stationIndex--;
                    if (t.stationIndex < 0) {
                        t.stationIndex = 0;
                        t.direction = 'down';
                        t.dest = line.downTerminals[Math.floor(Math.random() * line.downTerminals.length)] + '행';
                    }
                } else {
                    t.stationIndex++;
                    if (t.stationIndex >= total) {
                        t.stationIndex = total - 1;
                        t.direction = 'up';
                        t.dest = line.upTerminals[Math.floor(Math.random() * line.upTerminals.length)] + '행';
                    }
                }
            }
        });
    });

    renderMainMapTrains();
    renderActiveLineTrackFeed();
}

// ==========================================
// 4. SVG 종합 노선도 지도 렌더링
// ==========================================
function buildPathString(stations, isLoop = false) {
    if (!stations || stations.length === 0) return '';
    let d = `M ${stations[0].x} ${stations[0].y}`;
    for (let i = 1; i < stations.length; i++) {
        d += ` L ${stations[i].x} ${stations[i].y}`;
    }
    if (isLoop) {
        d += ` Z`;
    }
    return d;
}

function renderSvgNetworkMap() {
    svgLinesLayer.innerHTML = '';
    svgStationsLayer.innerHTML = '';
    svgLabelsLayer.innerHTML = '';

    renderBackgroundRiver();

    // 1~8호선 노선 패스 및 전체 정차역 생성
    Object.keys(METRO_NETWORK).forEach(lineNumStr => {
        const lineNum = parseInt(lineNumStr, 10);
        const line = METRO_NETWORK[lineNum];
        const isSelected = lineNum === currentLine;

        // 노선 선로 그룹
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `metro-line-group ${isSelected ? 'selected' : 'dimmed'}`);
        group.setAttribute('data-line', lineNum);
        group.setAttribute('id', `line-group-${lineNum}`);

        const isLoop = lineNum === 2;
        const d = buildPathString(line.stations, isLoop);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('class', 'metro-line-path');
        path.setAttribute('d', d);
        path.setAttribute('stroke', line.color);
        path.setAttribute('stroke-width', isSelected ? '8' : '3.5');

        path.addEventListener('click', () => selectLine(lineNum));
        group.appendChild(path);
        svgLinesLayer.appendChild(group);

        // 정차역 노드 및 텍스트 그룹
        const stGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        stGroup.setAttribute('class', `metro-station-group ${isSelected ? 'selected' : 'dimmed'}`);
        stGroup.setAttribute('data-line', lineNum);
        stGroup.setAttribute('id', `st-group-${lineNum}`);

        line.stations.forEach(st => {
            const isTransfer = st.transfer && st.transfer.length > 0;

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'station-dot');
            circle.setAttribute('cx', st.x);
            circle.setAttribute('cy', st.y);
            circle.setAttribute('r', isTransfer ? '6' : '4');
            circle.setAttribute('fill', isTransfer ? '#ffffff' : line.color);
            circle.setAttribute('stroke', isTransfer ? '#0f172a' : '#ffffff');
            circle.setAttribute('stroke-width', isTransfer ? '2.5' : '1.2');

            circle.addEventListener('click', (e) => {
                e.stopPropagation();
                selectLine(lineNum);
                openStationModal(st.name, lineNum);
            });

            // 역명 텍스트 라벨 (가독성을 위한 stroke 적용)
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('class', 'station-label');
            text.setAttribute('x', st.x + 8);
            text.setAttribute('y', st.y + 4);
            text.setAttribute('fill', isTransfer ? '#fef08a' : '#ffffff');
            text.textContent = st.name;

            stGroup.appendChild(circle);
            stGroup.appendChild(text);
        });

        svgStationsLayer.appendChild(stGroup);
    });

    renderMainMapTrains();
}

function renderBackgroundRiver() {
    svgGridLayer.innerHTML = '';
    const river = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const riverPath = 'M 0 2000 Q 800 1920 1600 1970 T 2600 1880 T 3600 1780';
    river.setAttribute('d', riverPath);
    river.setAttribute('fill', 'none');
    river.setAttribute('stroke', '#1e293b');
    river.setAttribute('stroke-width', '70');
    river.setAttribute('stroke-opacity', '0.7');
    river.setAttribute('stroke-linecap', 'round');
    svgGridLayer.appendChild(river);

    const riverLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    riverLabel.setAttribute('x', '3000');
    riverLabel.setAttribute('y', '1850');
    riverLabel.setAttribute('fill', '#334155');
    riverLabel.setAttribute('font-size', '24');
    riverLabel.setAttribute('font-weight', '900');
    riverLabel.setAttribute('letter-spacing', '12');
    riverLabel.textContent = '한   강';
    svgGridLayer.appendChild(riverLabel);
}

// ==========================================
// 5. SMSS 스타일 메인 지도 실시간 열차 카드 (물리적 정밀 위치 매핑)
// ==========================================
function renderMainMapTrains() {
    svgTrainsLayer.innerHTML = '';

    Object.keys(allTrains).forEach(lineNumStr => {
        const lineNum = parseInt(lineNumStr, 10);
        const line = METRO_NETWORK[lineNum];
        const isSelected = lineNum === currentLine;
        const trains = allTrains[lineNum];

        trains.forEach(t => {
            const st = line.stations[t.stationIndex];
            if (!st) return;

            const isUp = t.direction === 'up';
            const prevSt = line.stations[t.stationIndex - 1];
            const nextSt = line.stations[t.stationIndex + 1];

            const approachingFrom = isUp ? nextSt : prevSt;
            const departingTo = isUp ? prevSt : nextSt;

            let posX = st.x;
            let posY = st.y;

            // 상태(진입/도착/출발)에 따른 정밀 선로상 물리 위치 계산
            if (t.state === 'enter' && approachingFrom) {
                // 진입(enter): 이전 역에서 현재 역 쪽으로 65% 위치에 표시 (선로 위 실시간 위치)
                posX = approachingFrom.x + (st.x - approachingFrom.x) * 0.65;
                posY = approachingFrom.y + (st.y - approachingFrom.y) * 0.65;
            } else if (t.state === 'depart' && departingTo) {
                // 출발(depart): 현재 역에서 다음 역으로 35% 전진한 선로 지점
                posX = st.x + (departingTo.x - st.x) * 0.35;
                posY = st.y + (departingTo.y - st.y) * 0.35;
            } else {
                // 도착(arrive): 정확히 현재 역 플랫폼 위치
                posX = st.x;
                posY = st.y;
            }

            // 상행은 선로 좌측(-85), 하행은 선로 우측(+18)에 배치
            const offsetX = isUp ? -85 : 18;
            const offsetY = isUp ? -14 : 6;

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', `svg-train-card ${isSelected ? 'selected' : 'dimmed'}`);
            g.setAttribute('transform', `translate(${posX + offsetX}, ${posY + offsetY})`);

            if (isSelected) {
                const cardW = 66;
                const cardH = 22;

                const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bg.setAttribute('class', `svg-train-bg ${isUp ? 'up' : 'down'}`);
                bg.setAttribute('width', cardW);
                bg.setAttribute('height', cardH);

                const badgeW = 20;
                const badgeH = 12;
                const badgeBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                badgeBg.setAttribute('class', `svg-badge-bg ${t.state}`);
                badgeBg.setAttribute('x', 42);
                badgeBg.setAttribute('y', 5);
                badgeBg.setAttribute('width', badgeW);
                badgeBg.setAttribute('height', badgeH);

                const stateText = t.state === 'enter' ? '진입' : (t.state === 'arrive' ? '도착' : '출발');
                const badgeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                badgeLabel.setAttribute('class', 'svg-train-text');
                badgeLabel.setAttribute('x', 52);
                badgeLabel.setAttribute('y', 14);
                badgeLabel.setAttribute('text-anchor', 'middle');
                badgeLabel.setAttribute('font-size', '8');
                badgeLabel.setAttribute('font-weight', '800');
                badgeLabel.setAttribute('fill', '#ffffff');
                badgeLabel.textContent = stateText;

                const destText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                destText.setAttribute('class', 'svg-train-text');
                destText.setAttribute('x', 5);
                destText.setAttribute('y', 11);
                destText.setAttribute('font-size', '8.5');
                destText.setAttribute('font-weight', '800');
                destText.setAttribute('fill', isUp ? '#60a5fa' : '#f87171');
                destText.textContent = `${isUp ? '▲' : '▼'} ${t.dest.replace('행', '')}`;

                const noText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                noText.setAttribute('class', 'svg-train-text');
                noText.setAttribute('x', 5);
                noText.setAttribute('y', 19);
                noText.setAttribute('font-size', '7');
                noText.setAttribute('fill', '#94a3b8');
                noText.textContent = t.trainNo;

                g.appendChild(bg);
                g.appendChild(badgeBg);
                g.appendChild(badgeLabel);
                g.appendChild(destText);
                g.appendChild(noText);

                g.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openTrainModal(t, st.name);
                });
            } else {
                const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                dot.setAttribute('cx', 0);
                dot.setAttribute('cy', 0);
                dot.setAttribute('r', 2);
                dot.setAttribute('fill', '#64748b');
                dot.setAttribute('opacity', '0.2');
                g.appendChild(dot);
            }

            svgTrainsLayer.appendChild(g);
        });
    });
}

// ==========================================
// 6. 호선 선택 (단독 노출 및 자동 앵글 맞춤)
// ==========================================
function selectLine(targetLineNum) {
    if (!METRO_NETWORK[targetLineNum]) return;
    currentLine = targetLineNum;
    const line = METRO_NETWORK[currentLine];

    // 1) 탭 활성화 변경
    lineTabs.forEach(tab => {
        const tabLine = parseInt(tab.dataset.line, 10);
        if (tabLine === currentLine) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // 2) CSS 전역 테마 색상 동적 갱신
    document.documentElement.style.setProperty('--current-line', line.color);

    // 3) 배너 갱신
    bannerBadge.textContent = line.name;
    bannerTitle.textContent = `${line.name} 전 구간 실시간 열차 추적 중`;
    bannerSub.textContent = `${line.upName} ⟷ ${line.downName}`;

    // 4) SVG 클래스 교체 (선택된 호선은 selected, 나머지는 dimmed)
    Object.keys(METRO_NETWORK).forEach(numStr => {
        const num = parseInt(numStr, 10);
        const lineGroup = document.getElementById(`line-group-${num}`);
        const stGroup = document.getElementById(`st-group-${num}`);

        if (num === currentLine) {
            if (lineGroup) {
                lineGroup.classList.remove('dimmed');
                lineGroup.classList.add('selected');
                svgLinesLayer.appendChild(lineGroup);
            }
            if (stGroup) {
                stGroup.classList.remove('dimmed');
                stGroup.classList.add('selected');
                svgStationsLayer.appendChild(stGroup);
            }
        } else {
            if (lineGroup) {
                lineGroup.classList.remove('selected');
                lineGroup.classList.add('dimmed');
            }
            if (stGroup) {
                stGroup.classList.remove('selected');
                stGroup.classList.add('dimmed');
            }
        }
    });

    // 5) 메인 지도 열차 카드 및 우측 피드 재렌더링
    renderMainMapTrains();
    renderActiveLineTrackFeed();

    // 6) 선택된 호선 영역으로 메인 지도 자동 중앙 정렬
    focusOnLine(currentLine);
}

// 선택된 호선이 화면 중앙에 보기 좋게 오도록 자동 앵글 맞춤
function focusOnLine(lineNum) {
    const line = METRO_NETWORK[lineNum];
    if (!line || !line.stations.length) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    line.stations.forEach(st => {
        if (st.x < minX) minX = st.x;
        if (st.x > maxX) maxX = st.x;
        if (st.y < minY) minY = st.y;
        if (st.y > maxY) maxY = st.y;
    });

    const cX = (minX + maxX) / 2;
    const cY = (minY + maxY) / 2;
    const spanX = maxX - minX;
    const spanY = maxY - minY;

    // 3600 x 2900 SVG 캔버스 기준 중심 (1800, 1450)
    if (spanY < 800 && spanX < 1200) {
        zoomLevel = 1.35;
    } else if (spanY < 1500 && spanX < 1900) {
        zoomLevel = 1.1;
    } else {
        zoomLevel = 0.95;
    }

    panX = (1800 - cX) * zoomLevel;
    panY = (1450 - cY) * zoomLevel;
    updateTransform();
}

// ==========================================
// 7. 우측 상세 트랙 피드 렌더링
// ==========================================
function renderActiveLineTrackFeed() {
    const line = METRO_NETWORK[currentLine];
    const trains = allTrains[currentLine] || [];

    panelLineTitle.textContent = `${line.name} 전체 정차역 실시간 피드`;
    activeLineTrack.innerHTML = '';

    let upCount = 0;
    let downCount = 0;

    line.stations.forEach((station, index) => {
        const row = document.createElement('div');
        row.className = 'feed-station-row';
        row.dataset.stationName = station.name;

        const upTrains = trains.filter(t => t.direction === 'up' && t.stationIndex === index);
        const downTrains = trains.filter(t => t.direction === 'down' && t.stationIndex === index);

        upCount += upTrains.length;
        downCount += downTrains.length;

        // 좌측 상행
        const upSlot = document.createElement('div');
        upSlot.style.display = 'flex';
        upSlot.style.justifyContent = 'flex-end';
        upTrains.forEach(t => upSlot.appendChild(createFeedTrainCard(t, station.name, 'up')));

        // 중앙 역
        const centerNode = document.createElement('div');
        centerNode.className = 'feed-center-node';
        centerNode.addEventListener('click', () => openStationModal(station.name, currentLine));

        const circle = document.createElement('div');
        circle.className = 'feed-node-circle';

        const name = document.createElement('span');
        name.className = 'feed-station-name';
        name.textContent = station.name;

        centerNode.appendChild(circle);
        centerNode.appendChild(name);

        // 우측 하행
        const downSlot = document.createElement('div');
        downSlot.style.display = 'flex';
        downSlot.style.justifyContent = 'flex-start';
        downTrains.forEach(t => downSlot.appendChild(createFeedTrainCard(t, station.name, 'down')));

        row.appendChild(upSlot);
        row.appendChild(centerNode);
        row.appendChild(downSlot);
        activeLineTrack.appendChild(row);
    });

    totalTrainCount.textContent = upCount + downCount;
    upTrainCount.textContent = `${upCount}편`;
    downTrainCount.textContent = `${downCount}편`;

    applyStationSearch();
}

function createFeedTrainCard(train, stationName, dir) {
    const card = document.createElement('div');
    card.className = `feed-train-card ${dir}-card`;
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        openTrainModal(train, stationName);
    });

    const stateKorean = train.state === 'enter' ? '진입' : (train.state === 'arrive' ? '도착' : '출발');
    const dirArrow = dir === 'up' ? '▲' : '▼';

    card.innerHTML = `<span>${dirArrow}<strong>${train.dest}</strong></span>
                      <span class="f-badge ${train.state}">${stateKorean}</span>`;
    return card;
}

// ==========================================
// 8. 줌 & 팬 (Zoom & Pan) 기능 구현
// ==========================================
function updateTransform() {
    svgRootLayer.setAttribute('transform', `translate(${panX}, ${panY}) scale(${zoomLevel})`);
}

function zoom(delta, mouseX = null, mouseY = null) {
    const prevZoom = zoomLevel;
    let newZoom = zoomLevel + delta;
    newZoom = Math.min(3.5, Math.max(0.6, newZoom));

    if (mouseX !== null && mouseY !== null) {
        panX -= (mouseX - panX) * (newZoom / prevZoom - 1);
        panY -= (mouseY - panY) * (newZoom / prevZoom - 1);
    }

    zoomLevel = newZoom;
    updateTransform();
}

function resetZoom() {
    focusOnLine(currentLine);
}

svgMapWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = svgMapWrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    zoom(delta, mouseX, mouseY);
}, { passive: false });

svgMapWrapper.addEventListener('mousedown', (e) => {
    if (e.target.closest('.svg-train-card') || e.target.closest('.station-dot')) return;
    isPanning = true;
    startPanX = e.clientX - panX;
    startPanY = e.clientY - panY;
    svgMapWrapper.classList.add('is-dragging');
});

window.addEventListener('mousemove', (e) => {
    if (!isPanning) return;
    panX = e.clientX - startPanX;
    panY = e.clientY - startPanY;
    updateTransform();
});

window.addEventListener('mouseup', () => {
    isPanning = false;
    svgMapWrapper.classList.remove('is-dragging');
});

btnZoomIn.addEventListener('click', () => zoom(0.2));
btnZoomOut.addEventListener('click', () => zoom(-0.2));
btnZoomReset.addEventListener('click', resetZoom);

// ==========================================
// 9. 모달 팝업
// ==========================================
function openTrainModal(train, stationName) {
    modalTrainTitle.textContent = `${train.trainNo} 열차`;
    modalTrainType.textContent = train.type;
    modalTrainType.style.background = train.type === '급행' ? '#ef4444' : '#64748b';
    modalDestination.textContent = train.dest;
    const stateKorean = train.state === 'enter' ? '진입' : (train.state === 'arrive' ? '도착' : '출발');
    modalCurrStation.textContent = `${stationName}역 (${stateKorean})`;
    modalDirection.textContent = train.direction === 'up' ? '상행' : '하행';
    modalStatusText.textContent = train.isDelayed ? '지연 운행 (+3~5분)' : '정시 정상 운행';
    modalStatusText.style.color = train.isDelayed ? '#ef4444' : '#10b981';

    congestionCars.innerHTML = '';
    train.congestion.forEach((car, i) => {
        const box = document.createElement('div');
        box.className = `car-box ${car.level}`;
        box.innerHTML = `<span class="car-no">${i + 1}호</span><span>${car.rate}%</span>`;
        congestionCars.appendChild(box);
    });

    trainModal.classList.add('active');
}

function openStationModal(stationName, lineNum) {
    const line = METRO_NETWORK[lineNum];
    stModalLine.textContent = line.name;
    stModalName.textContent = `${stationName}역`;

    stUpList.innerHTML = '';
    stDownList.innerHTML = '';

    const trains = allTrains[lineNum] || [];
    const stationIndex = line.stations.findIndex(s => s.name === stationName);

    const upcomingUp = trains
        .filter(t => t.direction === 'up' && t.stationIndex >= stationIndex)
        .sort((a, b) => a.stationIndex - b.stationIndex)
        .slice(0, 3);

    const upcomingDown = trains
        .filter(t => t.direction === 'down' && t.stationIndex <= stationIndex)
        .sort((a, b) => b.stationIndex - a.stationIndex)
        .slice(0, 3);

    if (upcomingUp.length === 0) {
        stUpList.innerHTML = '<li class="arrival-item" style="color:#94a3b8;">도착 예정 열차가 없습니다.</li>';
    } else {
        upcomingUp.forEach((t, idx) => {
            const diff = t.stationIndex - stationIndex;
            const eta = diff === 0 ? '현재 도착 중' : `${diff * 2}분 후 도착 예정 (${diff}전역)`;
            const item = document.createElement('li');
            item.className = 'arrival-item';
            item.innerHTML = `<div class="arrival-dest">${t.dest} ${t.type === '급행' ? '<span style="color:#ef4444;">[급행]</span>' : ''}</div>
                              <div class="arrival-time">${idx === 0 ? '● ' : '○ '}${eta}</div>`;
            stUpList.appendChild(item);
        });
    }

    if (upcomingDown.length === 0) {
        stDownList.innerHTML = '<li class="arrival-item" style="color:#94a3b8;">도착 예정 열차가 없습니다.</li>';
    } else {
        upcomingDown.forEach((t, idx) => {
            const diff = stationIndex - t.stationIndex;
            const eta = diff === 0 ? '현재 도착 중' : `${diff * 2}분 후 도착 예정 (${diff}전역)`;
            const item = document.createElement('li');
            item.className = 'arrival-item';
            item.innerHTML = `<div class="arrival-dest">${t.dest} ${t.type === '급행' ? '<span style="color:#ef4444;">[급행]</span>' : ''}</div>
                              <div class="arrival-time">${idx === 0 ? '● ' : '○ '}${eta}</div>`;
            stDownList.appendChild(item);
        });
    }

    stationModal.classList.add('active');
}

// ==========================================
// 10. 검색 및 자동 줌인 포커싱
// ==========================================
function applyStationSearch() {
    const query = stationSearchInput.value.trim().toLowerCase();
    btnSearchClear.style.display = query.length > 0 ? 'block' : 'none';

    const rows = document.querySelectorAll('.feed-station-row');
    let firstMatch = null;

    rows.forEach(r => {
        const name = r.dataset.stationName.toLowerCase();
        if (query && name.includes(query)) {
            r.classList.add('search-hit');
            if (!firstMatch) firstMatch = r;
        } else {
            r.classList.remove('search-hit');
        }
    });

    if (firstMatch && query.length >= 2) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const targetLine = METRO_NETWORK[currentLine];
        const targetSt = targetLine.stations.find(s => s.name.toLowerCase().includes(query));
        if (targetSt) {
            zoomLevel = 1.35;
            panX = (1800 - targetSt.x) * zoomLevel;
            panY = (1450 - targetSt.y) * zoomLevel;
            updateTransform();
        }
    }
}

function updateClock() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('live-clock').textContent = `${y}. ${m}. ${d}. ${h}:${min}:${s}`;
}

function startRefreshCycle() {
    clearInterval(refreshTimerId);
    refreshCountdown = 10;
    refreshTimerText.textContent = `${refreshCountdown}초 후 갱신`;

    refreshTimerId = setInterval(() => {
        refreshCountdown--;
        if (refreshCountdown <= 0) {
            advanceAllTrains();
            refreshCountdown = 10;
        }
        refreshTimerText.textContent = `${refreshCountdown}초 후 갱신`;
    }, 1000);
}

// ==========================================
// 11. 초기화 및 이벤트 리스너 바인딩
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    initSimulationTrains();
    renderSvgNetworkMap();
    selectLine(1); // 1호선 기본 선택
    startRefreshCycle();

    lineTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const line = parseInt(e.currentTarget.dataset.line, 10);
            selectLine(line);
        });
    });

    btnManualRefresh.addEventListener('click', () => {
        advanceAllTrains();
        startRefreshCycle();
    });

    stationSearchInput.addEventListener('input', applyStationSearch);
    btnSearchClear.addEventListener('click', () => {
        stationSearchInput.value = '';
        applyStationSearch();
        stationSearchInput.focus();
    });

    modalCloseBtn.addEventListener('click', () => trainModal.classList.remove('active'));
    trainModal.addEventListener('click', (e) => {
        if (e.target === trainModal) trainModal.classList.remove('active');
    });

    stModalCloseBtn.addEventListener('click', () => stationModal.classList.remove('active'));
    stationModal.addEventListener('click', (e) => {
        if (e.target === stationModal) stationModal.classList.remove('active');
    });
});
