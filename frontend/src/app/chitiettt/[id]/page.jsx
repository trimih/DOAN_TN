"use client";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailPage({ params }) {
    const { data: news, error, isLoading } = useSWR(`http://localhost:3000/news/${params.id}`, fetcher, {
        refreshInterval: 6000,
    });

    if (error) return <div className="content">Lỗi load dữ liệu.</div>;
    if (isLoading) return <div className="content">Đang tải...</div>;
    return (
        <div className="content">
            <h2>{news.tiltle}</h2>
            <p>{news.description}</p>
            <img style={{width: '40%', height:'400px'}} src={news.image} alt={news.tiltle} />
            <p>Lưu ý:- Bộ sưu tập cốc đổi màu gồm có 6 màu cá tính: đỏ, xanh lá, vàng, xanh biển, hồng, than tre.- Ly quà tặng nhận được sẽ mang màu ngẫu nhiên.- Số lượng ly có hạn nên chương trình có thể kết thúc sớm hơn dự kiến.- Không áp dụng đồng thời với các chương trình ưu đãi khác hiện hành tại cửa hàng.#FESH #FESHVietnam #ThêmGắnKếtThêmVui</p>
        </div>
    );
}
