import React, { useMemo, useState } from "react";
import { Note } from "@/types";
import { formatDateToYMD } from "@/utils/formatDate";

interface CalendarHeatmapProps {
  notes: Note[];
  onDateSelect?: (date: string, notes: Note[]) => void;
}

// 获取某个月的天数
// const getDaysInMonth = (year: number, month: number): number => {
//   return new Date(year, month + 1, 0).getDate();
// };

// 生成过去3个月的日期数组
const generateCalendarDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();

  // 生成过去3个月的日期
  for (let i = 90; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(formatDateToYMD(date));
  }

  return dates;
};

// 计算日期颜色深度 (0-3)
const getColorIntensity = (count: number): number => {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  return 3;
};

export default function NotesNumber({
  notes,
  onDateSelect,
}: CalendarHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 按日期分组笔记
  const dateMap = useMemo(() => {
    const map = new Map<string, Note[]>();

    // 初始化日历日期
    generateCalendarDates().forEach((date) => {
      map.set(date, []);
    });

    // 将笔记按日期分组
    notes.forEach((note) => {
      const date = formatDateToYMD(new Date(note.create_time));
      if (map.has(date)) {
        map.get(date)?.push(note);
      } else {
        map.set(date, [note]);
      }
    });

    return map;
  }, [notes]);

  // 计算总数和本月新增数
  const totalNotes = notes.length;
  const currentMonth = new Date().getMonth();
  const totalMonth = notes.filter((note) => {
    const noteDate = new Date(note.create_time);
    return noteDate.getMonth() === currentMonth;
  }).length;

  // 处理日期方块点击事件
  const handleDateClick = (date: string) => {
    // 如果已选中，再次点击取消选中
    if (date === selectedDate) {
      setSelectedDate(null);
      if (onDateSelect) {
        onDateSelect("", notes); // 重置为全部笔记
      }
    } else {
      setSelectedDate(date);
      const dateNotes = dateMap.get(date) || [];
      if (onDateSelect) {
        onDateSelect(date, dateNotes); // 筛选对应日期笔记
      }
    }
  };

  // 获取当前月和最近3个月的日期数组
  const calendarDates = useMemo(() => {
    return generateCalendarDates();
  }, []);

  // 按周分组日期
  const weekGroupedDates = useMemo(() => {
    const weeks: string[][] = [];
    let currentWeek: string[] = [];

    // 我们需要调整第一天从周一开始 (1 = 周一, ..., 7 = 周日)
    const firstDate = new Date(calendarDates[0]);
    let firstDayOfWeek = firstDate.getDay(); // 0 = 周日, 1 = 周一, ...
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // 调整为周一=0，周日=6

    // 添加空单元格使日历对齐
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push("");
    }

    calendarDates.forEach((date, index) => {
      const dayObj = new Date(date);
      let dayOfWeek = dayObj.getDay();
      // 调整为周一=0，周日=6
      dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      currentWeek.push(date);

      if (dayOfWeek === 6 || index === calendarDates.length - 1) {
        // 补全不足一周的日期
        while (currentWeek.length < 7) {
          currentWeek.push("");
        }
        // 添加周末或最后一天后，完成一周
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    return weeks;
  }, [calendarDates]);

  // 获取月份名称
  // const getMonthLabels = () => {
  //   const months: { month: string; position: number }[] = [];
  //   let currentMonth = "";

  //   calendarDates.forEach((date, index) => {
  //     const month = date.substring(0, 7); // YYYY-MM
  //     if (month !== currentMonth) {
  //       months.push({
  //         month: new Date(date).toLocaleString("zh-CN", { month: "short" }),
  //         position: index,
  //       });
  //       currentMonth = month;
  //     }
  //   });

  //   return months;
  // };

  // const monthLabels = getMonthLabels();

  return (
    <div className="card border-base-300 border shadow-md">
      <div className="card-body p-4">
        <div className="card-title border-base-200 mb-2 flex items-center justify-between border-b pb-2">
          <span>创作日历</span>
          <span className="text-sm font-normal">总想法数: {totalNotes}</span>
        </div>

        {/* 月份标签 */}
        {/* <div className="relative mt-1 mb-1 flex h-5 px-5 text-xs">
          {monthLabels.map((item, index) => (
            <div
              key={index}
              className="absolute font-medium text-gray-500"
              style={{
                left: `${(item.position / calendarDates.length) * 100}%`,
                transform: "translateX(-50%)",
              }}
            >
              {item.month}
            </div>
          ))}
        </div> */}

        {/* 贡献热图 */}
        <div className="flex">
          {/* 日历格子 */}
          <div className="grid w-full grid-flow-col gap-1 overflow-x-auto pb-1">
            {weekGroupedDates.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  // 空单元格不渲染
                  if (!date)
                    return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className="h-4 w-4"
                      ></div>
                    );

                  const dayNotes = dateMap.get(date) || [];
                  const count = dayNotes.length;
                  const intensity = getColorIntensity(count);
                  const isSelected = date === selectedDate;

                  const today = new Date();
                  const isToday = formatDateToYMD(today) === date;

                  return (
                    <div
                      key={date}
                      className={`h-4 w-4 cursor-pointer rounded-sm transition-all hover:scale-105 ${
                        isSelected ? "ring-primary ring-2 ring-offset-1" : ""
                      } ${
                        intensity === 0
                          ? "bg-base-300"
                          : intensity === 1
                            ? "bg-primary/30"
                            : intensity === 2
                              ? "bg-primary/60"
                              : "bg-primary"
                      } ${isToday ? "border-primary border" : ""}`}
                      onClick={() => handleDateClick(date)}
                      title={`${date}: ${count}条想法`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="border-base-200 mt-3 flex items-center justify-between border-t pt-2 text-xs">
          <div>
            本月新增: <span className="font-semibold">{totalMonth}</span>篇
          </div>
          <div className="flex items-center gap-1">
            <span>活跃度:</span>
            <div className="bg-base-300 border-base-200 h-3 w-3 border"></div>
            <div className="bg-primary/30 h-3 w-3"></div>
            <div className="bg-primary/60 h-3 w-3"></div>
            <div className="bg-primary h-3 w-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
