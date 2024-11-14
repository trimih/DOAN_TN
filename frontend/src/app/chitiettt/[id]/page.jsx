"use client";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailPage({ params }) {
    const { data: news, error, isLoading } = useSWR(`http://localhost:3000/news/${params.id}`, fetcher, {
        refreshInterval: 6000,
    });

    if (error) return <div>Lỗi load dữ liệu.</div>;
    if (isLoading) return <div>Đang tải...</div>;
    return (
        <>
 <div class="content">
        <h2>{news.tiltle}</h2>

        <img src={news.image} alt={news.tiltle}/>
        <h3> <p>lượt xem:</p>{news.view}</h3>
        <p>
        {news.description}
        </p>
    </div>
        </>
    );
}
