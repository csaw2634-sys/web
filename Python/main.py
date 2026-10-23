
import pandas as pd
from pathlib import Path

# 1. main.py가 위치한 폴더 확인
folder = Path(__file__).resolve().parent

# 2. CSV 파일 경로 설정
file_path = folder / "webtoon_drama_70.csv"

# 3. CSV 파일 불러오기
df = pd.read_csv(file_path, encoding="utf-8-sig")

# 4. 처음 5개 데이터 출력
print("=== 웹툰 데이터 ===")
print(df.head())

# 5. 전체 데이터 크기 출력
print("\n=== 데이터 크기 ===")
print(df.shape)

# 6. 비어 있는 값 확인
print("\n=== 결측치 ===")
print(df.isnull().sum())

=== 웹툰 데이터 ===
          title       author      platform ...
0         ...
1         ...
2         ...

=== 데이터 크기 ===
(70, 16)

=== 결측치 ===
title             25
author            25
platform          25
...