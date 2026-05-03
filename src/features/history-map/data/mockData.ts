const mockData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "shang-dynasty",
        "nameKey": "type_dynasty_shang",
        "descKey": "desc_shang",
        "type": "dynasty",
        "startYear": -1600,
        "endYear": -1047,
        "tags": ["bronze-age", "oracle-bones", "yellow-river"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.0, 38.0], [118.0, 38.0], [120.0, 35.0], [118.0, 32.0], [114.0, 32.0], [112.0, 34.0], [112.0, 38.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "shang-yin",
        "nameKey": "type_shang_yin",
        "descKey": "desc_shang_yin",
        "type": "capital",
        "startYear": -1300,
        "endYear": -1047,
        "tags": ["殷墟", "河南"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[114.0, 36.0], [116.0, 36.0], [116.0, 34.0], [114.0, 34.0], [114.0, 36.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "zhou-dynasty",
        "nameKey": "type_dynasty_zhou",
        "descKey": "desc_zhou",
        "type": "dynasty",
        "startYear": -1046,
        "endYear": -257,
        "tags": ["mandate-of-heaven", "confucius", "iron-age"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[105.0, 40.0], [120.0, 40.0], [122.0, 35.0], [120.0, 30.0], [115.0, 28.0], [108.0, 28.0], [104.0, 32.0], [105.0, 40.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "zhou-west",
        "nameKey": "type_zhou_west",
        "descKey": "desc_zhou_west",
        "type": "capital",
        "startYear": -1046,
        "endYear": -771,
        "tags": ["西周", "镐京"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[108.0, 35.0], [112.0, 35.0], [112.0, 32.0], [108.0, 32.0], [108.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "zhou-east",
        "nameKey": "type_zhou_east",
        "descKey": "desc_zhou_east",
        "type": "capital",
        "startYear": -770,
        "endYear": -257,
        "tags": ["东周", "洛邑"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.0, 35.0], [116.0, 35.0], [116.0, 32.0], [112.0, 32.0], [112.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "spring-autumn",
        "nameKey": "type_spring_autumn",
        "descKey": "desc_spring_autumn",
        "type": "dynasty",
        "startYear": -770,
        "endYear": -477,
        "tags": ["春秋", "诸侯"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[108.0, 38.0], [118.0, 38.0], [120.0, 34.0], [118.0, 30.0], [112.0, 28.0], [106.0, 30.0], [105.0, 34.0], [108.0, 38.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "warring-states",
        "nameKey": "type_warring_states",
        "descKey": "desc_warring_states",
        "type": "dynasty",
        "startYear": -475,
        "endYear": -222,
        "tags": ["战国", "七雄"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[100.0, 42.0], [125.0, 42.0], [128.0, 35.0], [125.0, 28.0], [118.0, 24.0], [108.0, 24.0], [100.0, 30.0], [98.0, 38.0], [100.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "qi-state",
        "nameKey": "type_qi",
        "descKey": "desc_qi",
        "type": "capital",
        "startYear": -475,
        "endYear": -221,
        "tags": ["齐国", "山东"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[118.0, 38.0], [122.0, 38.0], [122.0, 35.0], [118.0, 35.0], [118.0, 38.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "chu-state",
        "nameKey": "type_chu",
        "descKey": "desc_chu",
        "type": "capital",
        "startYear": -475,
        "endYear": -221,
        "tags": ["楚国", "湖北"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.0, 32.0], [120.0, 32.0], [120.0, 28.0], [112.0, 28.0], [112.0, 32.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "qin-dynasty",
        "nameKey": "type_dynasty_qin",
        "descKey": "desc_qin",
        "type": "dynasty",
        "startYear": -221,
        "endYear": -207,
        "tags": ["unification", "terracotta", "great-wall"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[105.0, 38.0], [120.0, 38.0], [122.0, 32.0], [118.0, 25.0], [112.0, 22.0], [106.0, 25.0], [102.0, 30.0], [105.0, 38.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "han-dynasty",
        "nameKey": "type_dynasty_han",
        "descKey": "desc_han",
        "type": "dynasty",
        "startYear": -202,
        "endYear": 219,
        "tags": ["silk-road", "paper-invention", "confucian-state"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[95.0, 42.0], [125.0, 42.0], [128.0, 35.0], [125.0, 25.0], [118.0, 20.0], [108.0, 20.0], [100.0, 25.0], [92.0, 35.0], [95.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "han-west",
        "nameKey": "type_han_west",
        "descKey": "desc_han_west",
        "type": "capital",
        "startYear": -202,
        "endYear": 8,
        "tags": ["西汉", "长安"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[105.0, 35.0], [112.0, 35.0], [112.0, 32.0], [105.0, 32.0], [105.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "han-east",
        "nameKey": "type_han_east",
        "descKey": "desc_han_east",
        "type": "capital",
        "startYear": 25,
        "endYear": 219,
        "tags": ["东汉", "洛阳"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.0, 35.0], [116.0, 35.0], [116.0, 32.0], [112.0, 32.0], [112.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "three-kingdoms",
        "nameKey": "type_three_kingdoms",
        "descKey": "desc_three_kingdoms",
        "type": "dynasty",
        "startYear": 220,
        "endYear": 279,
        "tags": ["three-kingdoms", "分散", "战"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[95.0, 42.0], [125.0, 42.0], [128.0, 35.0], [125.0, 25.0], [118.0, 20.0], [108.0, 20.0], [100.0, 25.0], [92.0, 35.0], [95.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "wei-kingdom",
        "nameKey": "type_wei",
        "descKey": "desc_wei",
        "type": "capital",
        "startYear": 220,
        "endYear": 265,
        "tags": ["曹魏", "中原"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[110.0, 42.0], [125.0, 42.0], [128.0, 35.0], [125.0, 25.0], [115.0, 22.0], [108.0, 25.0], [105.0, 32.0], [110.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "shu-kingdom",
        "nameKey": "type_shu",
        "descKey": "desc_shu",
        "type": "capital",
        "startYear": 221,
        "endYear": 263,
        "tags": ["蜀汉", "四川"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[100.0, 32.0], [108.0, 32.0], [110.0, 28.0], [108.0, 25.0], [100.0, 25.0], [98.0, 28.0], [100.0, 32.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "wu-kingdom",
        "nameKey": "type_wu",
        "descKey": "desc_wu",
        "type": "capital",
        "startYear": 229,
        "endYear": 280,
        "tags": ["东吴", "江东"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[115.0, 35.0], [125.0, 35.0], [125.0, 28.0], [118.0, 22.0], [112.0, 22.0], [110.0, 28.0], [115.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "jin-dynasty",
        "nameKey": "type_dynasty_jin",
        "descKey": "desc_jin",
        "type": "dynasty",
        "startYear": 281,
        "endYear": 419,
        "tags": ["九品中正制", "玄学", "南迁"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[100.0, 38.0], [118.0, 38.0], [120.0, 32.0], [115.0, 25.0], [108.0, 22.0], [100.0, 25.0], [98.0, 32.0], [100.0, 38.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "jin-west",
        "nameKey": "type_jin_west",
        "descKey": "desc_jin_west",
        "type": "capital",
        "startYear": 281,
        "endYear": 316,
        "tags": ["西晋", "洛阳"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.0, 35.0], [116.0, 35.0], [116.0, 32.0], [112.0, 32.0], [112.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "jin-east",
        "nameKey": "type_jin_east",
        "descKey": "desc_jin_east",
        "type": "capital",
        "startYear": 317,
        "endYear": 419,
        "tags": ["东晋", "建康"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[118.0, 32.0], [122.0, 32.0], [122.0, 28.0], [118.0, 28.0], [118.0, 32.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "southern-northern",
        "nameKey": "type_southern_northern",
        "descKey": "desc_southern_northern",
        "type": "dynasty",
        "startYear": 420,
        "endYear": 589,
        "tags": ["南北朝", "佛教", "士族"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[95.0, 42.0], [125.0, 42.0], [128.0, 35.0], [122.0, 28.0], [110.0, 22.0], [95.0, 28.0], [92.0, 35.0], [95.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "sui-dynasty",
        "nameKey": "type_dynasty_sui",
        "descKey": "desc_sui",
        "type": "dynasty",
        "startYear": 590,
        "endYear": 617,
        "tags": ["reunification", "grand-canal", "sui-tang"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[95.0, 42.0], [122.0, 42.0], [125.0, 35.0], [120.0, 25.0], [110.0, 22.0], [100.0, 25.0], [95.0, 35.0], [95.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "sui-dadu",
        "nameKey": "type_sui_dadu",
        "descKey": "desc_sui_dadu",
        "type": "capital",
        "startYear": 590,
        "endYear": 617,
        "tags": ["大兴城", "长安"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[108.0, 35.0], [112.0, 35.0], [112.0, 32.0], [108.0, 32.0], [108.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "tang-dynasty",
        "nameKey": "type_dynasty_tang",
        "descKey": "desc_tang",
        "type": "dynasty",
        "startYear": 619,
        "endYear": 906,
        "tags": ["cosmopolitan", "poetry", "buddhism"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[90.0, 45.0], [125.0, 45.0], [130.0, 38.0], [125.0, 25.0], [118.0, 18.0], [105.0, 18.0], [95.0, 25.0], [85.0, 35.0], [90.0, 45.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "tang-changan",
        "nameKey": "type_tang_changan",
        "descKey": "desc_tang_changan",
        "type": "capital",
        "startYear": 618,
        "endYear": 906,
        "tags": ["长安", "西域"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[108.0, 35.0], [112.0, 35.0], [112.0, 32.0], [108.0, 32.0], [108.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "tang-luoyang",
        "nameKey": "type_tang_luoyang",
        "descKey": "desc_tang_luoyang",
        "type": "capital",
        "startYear": 690,
        "endYear": 906,
        "tags": ["洛阳", "东都"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.0, 35.0], [116.0, 35.0], [116.0, 32.0], [112.0, 32.0], [112.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "five-dynasties",
        "nameKey": "type_five_dynasties",
        "descKey": "desc_five_dynasties",
        "type": "dynasty",
        "startYear": 908,
        "endYear": 959,
        "tags": ["五代", "十国"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[95.0, 42.0], [125.0, 42.0], [128.0, 35.0], [125.0, 28.0], [115.0, 22.0], [100.0, 25.0], [95.0, 32.0], [95.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "song-dynasty",
        "nameKey": "type_dynasty_song",
        "descKey": "desc_song",
        "type": "dynasty",
        "startYear": 960,
        "endYear": 1279,
        "tags": ["neo-confucianism", "gunpowder", "compass"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[105.0, 40.0], [122.0, 40.0], [122.0, 32.0], [118.0, 25.0], [110.0, 22.0], [105.0, 25.0], [105.0, 40.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "song-north",
        "nameKey": "type_song_north",
        "descKey": "desc_song_north",
        "type": "capital",
        "startYear": 960,
        "endYear": 1127,
        "tags": ["北宋", "开封"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[112.0, 35.0], [118.0, 35.0], [118.0, 32.0], [112.0, 32.0], [112.0, 35.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "song-south",
        "nameKey": "type_song_south",
        "descKey": "desc_song_south",
        "type": "capital",
        "startYear": 1127,
        "endYear": 1279,
        "tags": ["南宋", "临安"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[118.0, 32.0], [122.0, 32.0], [122.0, 28.0], [118.0, 28.0], [118.0, 32.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "yuan-dynasty",
        "nameKey": "type_dynasty_yuan",
        "descKey": "desc_yuan",
        "type": "dynasty",
        "startYear": 1271,
        "endYear": 1367,
        "tags": ["mongol-empire", "marco-polo", "pax-mongolica"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[85.0, 50.0], [130.0, 50.0], [132.0, 40.0], [125.0, 25.0], [115.0, 18.0], [100.0, 22.0], [88.0, 30.0], [85.0, 50.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "yuan-dadu",
        "nameKey": "type_yuan_dadu",
        "descKey": "desc_yuan_dadu",
        "type": "capital",
        "startYear": 1271,
        "endYear": 1367,
        "tags": ["大都", "北京"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[116.0, 40.0], [118.0, 40.0], [118.0, 38.0], [116.0, 38.0], [116.0, 40.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "ming-dynasty",
        "nameKey": "type_dynasty_ming",
        "descKey": "desc_ming",
        "type": "dynasty",
        "startYear": 1368,
        "endYear": 1643,
        "tags": ["恢复汉族", "郑和", "紫禁城"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[100.0, 45.0], [125.0, 45.0], [128.0, 38.0], [125.0, 28.0], [118.0, 22.0], [105.0, 22.0], [98.0, 28.0], [95.0, 38.0], [100.0, 45.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "ming-nanjing",
        "nameKey": "type_ming_nanjing",
        "descKey": "desc_ming_nanjing",
        "type": "capital",
        "startYear": 1368,
        "endYear": 1421,
        "tags": ["南京", "应天府"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[118.0, 32.0], [122.0, 32.0], [122.0, 28.0], [118.0, 28.0], [118.0, 32.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "ming-beijing",
        "nameKey": "type_ming_beijing",
        "descKey": "desc_ming_beijing",
        "type": "capital",
        "startYear": 1421,
        "endYear": 1643,
        "tags": ["北京", "顺天府"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[116.0, 40.0], [118.0, 40.0], [118.0, 38.0], [116.0, 38.0], [116.0, 40.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "qing-dynasty",
        "nameKey": "type_dynasty_qing",
        "descKey": "desc_qing",
        "type": "dynasty",
        "startYear": 1644,
        "endYear": 1911,
        "tags": ["清朝", "满族", "最后一次统一"],
        "lodLevel": 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[85.0, 52.0], [135.0, 52.0], [140.0, 42.0], [135.0, 28.0], [125.0, 22.0], [110.0, 22.0], [100.0, 28.0], [85.0, 42.0], [85.0, 52.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "qing-shengjing",
        "nameKey": "type_qing_shengjing",
        "descKey": "desc_qing_shengjing",
        "type": "capital",
        "startYear": 1644,
        "endYear": 1911,
        "tags": ["盛京", "奉天"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[122.0, 42.0], [126.0, 42.0], [126.0, 38.0], [122.0, 38.0], [122.0, 42.0]]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "qing-beijing",
        "nameKey": "type_qing_beijing",
        "descKey": "desc_qing_beijing",
        "type": "capital",
        "startYear": 1644,
        "endYear": 1911,
        "tags": ["北京", "顺天府"],
        "lodLevel": 2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[116.0, 40.0], [118.0, 40.0], [118.0, 38.0], [116.0, 38.0], [116.0, 40.0]]]
      }
    }
  ]
};

export default mockData;