# -*- coding: utf-8 -*-
import os

def analyze_file(file_path):
    """텍스트 파일을 읽어서 내용 분석"""
    if not os.path.exists(file_path):
        return None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    return content

# 파일 분석
files = {
    '체육활동_프로그램.txt': '시니어 체육활동 프로그램',
    '홈페이지_시니온.txt': '홈페이지에 실릴 시니온'
}

print("=" * 80)
print("HWP 파일 분석 결과")
print("=" * 80)

for file_path, title in files.items():
    if os.path.exists(file_path):
        print(f"\n{'='*80}")
        print(f"파일: {title}")
        print(f"{'='*80}\n")
        
        content = analyze_file(file_path)
        if content:
            # 내용 출력
            print(content)
            print(f"\n총 글자 수: {len(content)}자")
        else:
            print("내용을 읽을 수 없습니다.")
        
        print("\n")



