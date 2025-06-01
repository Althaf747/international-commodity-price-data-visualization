  const margin = {top: 50, right: 130, bottom: 70, left: 120};
  const width = 835 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const yearsRange = d3.range(2005, 2025);
  let allData = [];

  // Commodity categories
  const metalsCommodities = [
    'ALUMINUM', 'COPPER', 'GOLD', 'LEAD', 'NICKEL',
    'PLATINUM', 'SILVER', 'Tin', 'Zinc', 'IRON_ORE'
  ];

  const energyCommodities = [
    'COAL_AUS', 'COAL_SAFRICA', 'CRUDE_BRENT', 'CRUDE_DUBAI',
    'CRUDE_PETRO', 'CRUDE_WTI', 'iNATGAS', 'NGAS_EUR', 'NGAS_JP', 'NGAS_US'
  ];

  const agricultureCommodities = [
    'BARLEY', 'COTTON_A_INDX', 'MAIZE', 'RICE_05', 'RICE_05_VNM',
    'RICE_25', 'RICE_A1', 'SORGHUM', 'SOYBEAN_MEAL',
    'SOYBEANS', 'WHEAT_US_HRW', 'WHEAT_US_SRW', 'GRNUT'
  ];

  const plantationsCommodities = [
    'BANANA_EU', 'BANANA_US', 'COCOA', 'COFFEE_ARABIC',
    'COFFEE_ROBUS', 'ORANGE', 'SUGAR_EU',
    'SUGAR_US', 'SUGAR_WLD', 'TEA_AVG', 'TEA_COLOMBO', 'TEA_KOLKATA',
    'TEA_MOMBASA'
  ];

  const vegetableOilsCommodities = [
    'COCONUT_OIL', 'PALM_OIL', 'PLMKRNL_OIL', 'SOYBEAN_OIL', 'GRNUT_OIL'
  ];

  const nonFoodAgricultureCommodities = [
    'TOBAC_US'
  ];

  const seafoodCommodities = [
    'TUNA_SJCSI', 'TUNA_SJFEP', 'TUNA_SJWPO',
    'TUNA_YFCSI', 'TUNA_YFFEP', 'TUNA_YFWPO', 'SHRIMP_MEX'
  ];

  const animalProductsCommodities = [
    'BEEF'
  ];

  const processedProductsCommodities = [
    'FISH_MEAL'
  ];

  const timberCommodities = [
    'LOGS_CMR', 'LOGS_MYS', 'PLYWOOD', 'SAWNWD_CMR', 'SAWNWD_MYS'
  ];

  const mineralFertilizersCommodities = [
    'DAP', 'PHOSROCK', 'POTASH', 'TSP', 'UREA_EE_BULK'
  ];

  // Unit function for tooltip
  function getUnitByCommodity(commodity) {
    const crudeOilCommodities = ['CRUDE_WTI', 'CRUDE_BRENT', 'CRUDE_DUBAI', 'CRUDE_PETRO'];
    const gasCommodities = ['iNATGAS', 'NGAS_US', 'NGAS_JP', 'NGAS_EUR'];
    const coalCommodities = ['COAL_AUS', 'COAL_SAFRICA'];
    const unitUSDMT = [
      'ALUMINUM', 'COPPER', 'GOLD', 'LEAD', 'NICKEL',
      'PLATINUM', 'SILVER', 'Tin', 'Zinc', 'IRON_ORE',
      'DAP', 'PHOSROCK', 'POTASH', 'TSP', 'UREA_EE_BULK'
    ];
    const unitUSDperKg = [
      'SHRIMP_MEX', 'TUNA_SJCSI', 'TUNA_SJFEP', 'TUNA_SJWPO', 'TUNA_YFCSI',
      'TUNA_YFFEP', 'TUNA_YFWPO', 'BEEF',
      'RICE_05', 'RICE_05_VNM', 'RICE_25', 'RICE_A1', 'WHEAT_US_HRW', 'WHEAT_US_SRW',
      'COCONUT_OIL', 'PALM_OIL', 'PLMKRNL_OIL', 'SOYBEAN_OIL', 'GRNUT_OIL'
    ];

    if (crudeOilCommodities.includes(commodity)) return "USD/bbl";
    if (gasCommodities.includes(commodity)) return "USD/MMBtu";
    if (coalCommodities.includes(commodity)) return "USD/MT";
    if (unitUSDMT.includes(commodity)) return "USD/MT";
    if (unitUSDperKg.includes(commodity)) return "USD/kg";

    return "USD";
  }

  // Draw line chart for Energy
  function drawLineChartEnergy(containerId, tooltipId, commoditiesToPlot, category = "oil") {
    const container = d3.select(containerId);
    const svg = container.select("svg");
    svg.selectAll("*").remove();
    const tooltip = d3.select(tooltipId);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const filtered = allData.filter(d =>
      d.Category === "Energi" &&
      commoditiesToPlot.includes(d.COMMODITY) &&
      yearsRange.includes(+d.TIME_PERIOD.split("-")[0])
    );

    const grouped = {};
    filtered.forEach(d => {
      const comm = d.COMMODITY.trim();
      const year = +d.TIME_PERIOD.split("-")[0];
      const val = +d.OBS_VALUE;
      if (!grouped[comm]) grouped[comm] = {};
      if (!grouped[comm][year]) grouped[comm][year] = [];
      grouped[comm][year].push(val);
    });

    const commodities = Object.keys(grouped);

    const processed = {};
    commodities.forEach(comm => {
      processed[comm] = yearsRange.map(year => {
        const vals = grouped[comm][year] || [];
        return { year, value: vals.length ? d3.mean(vals) : 0 };
      });
    });

    const maxY = d3.max(commodities, comm => d3.max(processed[comm], d => d.value));

    const xScale = d3.scaleLinear()
      .domain([yearsRange[0], yearsRange[yearsRange.length - 1]])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1])
      .range([height, 0]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    g.append("g")
      .call(yAxis);

    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .attr("class", "text-gray-700 font-semibold")
      .text(category === "oil" ? "Average Price (USD per barrel)" : category === "gas" ? "Average Price (USD per MMBtu)" : "Average Price (USD per Metric Ton)");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("class", "text-gray-700 font-semibold")
      .text(category === "oil" ? "Average Price (USD per barrel)" : category === "gas" ? "Average Price (USD per MMBtu)" : "Average Price (USD per Metric Ton)");

    const colorScale = d3.scaleOrdinal()
      .domain(commodities)
      .range(d3.schemeTableau10.concat(d3.schemeSet3).slice(0, commodities.length));

    const lineGen = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    commodities.forEach(comm => {
      g.append("path")
        .datum(processed[comm])
        .attr("fill", "none")
        .attr("stroke", colorScale(comm))
        .attr("stroke-width", 3)
        .attr("d", lineGen);

      g.selectAll(`.point-${comm}`)
        .data(processed[comm])
        .enter()
        .append("circle")
        .attr("class", `point-${comm}`)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 7)
        .attr("fill", colorScale(comm))
        .attr("opacity", 0.8)
        .on("mousemove", (event, d) => {
          const [x, y] = d3.pointer(event);
          const unit = getUnitByCommodity(comm);
          tooltip.style("visibility", "visible")
            .html(`<strong>${comm.replace(/_/g, " ")}</strong><br>Year: ${d.year}<br>Price: ${d.value.toFixed(2)} ${unit}`)
            .style("left", (x + margin.left + 15) + "px")
            .style("top", (y + margin.top - 30) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

      const lastPoint = processed[comm][processed[comm].length - 1];
      g.append("text")
        .attr("x", xScale(lastPoint.year) + 10)
        .attr("y", yScale(lastPoint.value))
        .attr("fill", colorScale(comm))
        .attr("font-weight", "600")
        .attr("alignment-baseline", "middle")
        .text(comm.replace(/_/g, " "));
    });
  }

  // Draw heatmap for Metals and Fertilizers
  function drawHeatmapCategory(containerId, tooltipId, selectedCommodities) {
    const container = d3.select(containerId);
    const svg = container.select("svg");
    svg.selectAll("*").remove();
    const tooltip = d3.select(tooltipId);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const filtered = allData.filter(d =>
      selectedCommodities.includes(d.COMMODITY) &&
      yearsRange.includes(+d.TIME_PERIOD.split("-")[0])
    );

    const grouped = {};
    filtered.forEach(d => {
      const comm = d.COMMODITY.trim();
      const year = +d.TIME_PERIOD.split("-")[0];
      const val = +d.OBS_VALUE;
      if (!grouped[comm]) grouped[comm] = {};
      if (!grouped[comm][year]) grouped[comm][year] = [];
      grouped[comm][year].push(val);
    });

    const heatmapData = [];
    Object.keys(grouped).forEach(comm => {
      yearsRange.forEach(year => {
        const vals = grouped[comm][year] || [];
        heatmapData.push({
          comm,
          year,
          value: vals.length ? d3.mean(vals) : 0
        });
      });
    });

    const xScale = d3.scaleBand()
      .domain(yearsRange)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(Object.keys(grouped))
      .range([0, height])
      .padding(0.05);

    const maxVal = d3.max(heatmapData, d => d.value);
    const colorScale = d3.scaleSequential()
      .domain([0, maxVal || 1])
      .interpolator(d3.interpolateYlOrRd);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickValues(yearsRange.filter(y => y % 2 === 0)))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .text("Year");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 30)
      .attr("text-anchor", "middle")
      .text("Commodity");

    g.selectAll(".cell")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(d.comm))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.value))
      .on("mousemove", (event, d) => {
        const containerPos = document.getElementById(containerId.substring(1)).getBoundingClientRect();
        const offsetX = event.clientX - containerPos.left;
        const offsetY = event.clientY - containerPos.top;

        const unit = getUnitByCommodity(d.comm);
        tooltip.style("visibility", "visible")
          .html(`<strong>${d.comm.replace(/_/g, " ")}</strong><br>Year: ${d.year}<br>Price: ${d.value.toFixed(2)} ${unit}`)
          .style("top", (offsetY + 15) + "px")
          .style("left", (offsetX + 15) + "px");
      })
      .on("mouseout", () => tooltip.style("visibility", "hidden"));
  }

  // Draw area chart for Food and Related Commodities
  function drawAreaChartFood(containerId, tooltipId, commodities) {
    const container = d3.select(containerId);
    const svg = container.select("svg");
    svg.selectAll("*").remove();
    const tooltip = d3.select(tooltipId);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const filtered = allData.filter(d =>
      commodities.includes(d.COMMODITY) &&
      yearsRange.includes(+d.TIME_PERIOD.split("-")[0]) &&
      +d.OBS_VALUE >= 0
    );

    if (filtered.length === 0) {
      g.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#888")
        .text(`No data available for this category.`);
      return;
    }

    const grouped = {};
    filtered.forEach(d => {
      const comm = d.COMMODITY.trim();
      const year = +d.TIME_PERIOD.split("-")[0];
      const val = +d.OBS_VALUE;
      if (!grouped[comm]) grouped[comm] = {};
      if (!grouped[comm][year]) grouped[comm][year] = [];
      grouped[comm][year].push(val);
    });

    const commoditiesKeys = Object.keys(grouped);

    const processed = {};
    commoditiesKeys.forEach(comm => {
      processed[comm] = yearsRange.map(year => {
        const vals = grouped[comm][year] || [];
        return { year, value: vals.length ? d3.mean(vals) : 0 };
      });
    });

    let maxY = d3.max(commoditiesKeys, comm => d3.max(processed[comm], d => d.value));
    maxY = maxY < 1 ? 1 : maxY;

    const xScale = d3.scaleLinear()
      .domain([yearsRange[0], yearsRange[yearsRange.length - 1]])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.1])
      .range([height, 0]);

    const xStep = 40;
    const yStep = 30;
    const numCols = Math.floor(width / xStep);
    const numRows = Math.floor(height / yStep);

    for (let i = 0; i <= numCols; i++) {
      for (let j = 0; j <= numRows; j++) {
        g.append("circle")
          .attr("cx", i * xStep)
          .attr("cy", j * yStep)
          .attr("r", 2)
          .attr("fill", "#d1d5db")
          .attr("opacity", 0.4);
      }
    }

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")));

    g.append("g")
      .call(d3.axisLeft(yScale));

    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + 45)
      .attr("text-anchor", "middle")
      .attr("class", "text-gray-700 font-semibold")
      .text("Year");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("class", "text-gray-700 font-semibold")
      .text("Average Price (USD)");

    commoditiesKeys.sort((a, b) => {
      const lastA = processed[a][processed[a].length - 1].value;
      const lastB = processed[b][processed[b].length - 1].value;
      return lastB - lastA;
    });

    const colorScale = d3.scaleOrdinal()
      .domain(commoditiesKeys)
      .range(d3.schemeTableau10.concat(d3.schemeSet3).slice(0, commoditiesKeys.length));

    const areaGen = d3.area()
      .x(d => xScale(d.year))
      .y0(yScale(0))
      .y1(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    commoditiesKeys.forEach(comm => {
      g.append("path")
        .datum(processed[comm])
        .attr("fill", colorScale(comm))
        .attr("fill-opacity", 0.3)
        .attr("stroke", colorScale(comm))
        .attr("stroke-width", 2)
        .attr("d", areaGen);

      g.selectAll(`.point-${comm}`)
        .data(processed[comm])
        .enter()
        .append("circle")
        .attr("class", `point-${comm}`)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 6)
        .attr("fill", colorScale(comm))
        .attr("opacity", 0.7)
        .on("mousemove", (event, d) => {
          const [x, y] = d3.pointer(event);
          const unit = getUnitByCommodity(comm);
          tooltip.style("visibility", "visible")
            .html(`<strong>${comm.replace(/_/g, " ")}</strong><br>Year: ${d.year}<br>Price: ${d.value.toFixed(2)} ${unit}`)
            .style("left", (x + margin.left + 15) + "px")
            .style("top", (y + margin.top - 30) + "px");
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

      const lastPoint = processed[comm][processed[comm].length - 1];
      g.append("text")
        .attr("x", xScale(lastPoint.year) + 10)
        .attr("y", yScale(lastPoint.value))
        .attr("fill", colorScale(comm))
        .attr("font-weight", "600")
        .attr("alignment-baseline", "middle")
        .text(comm.replace(/_/g, " "));
    });
  }

  // Event listeners for Energy buttons
  const energyButtons = document.querySelectorAll(".energy-btn");
  energyButtons.forEach(btn => {
    if (btn.dataset.commodity === "oil") {
      btn.classList.add("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "false");
    }

    btn.addEventListener("click", () => {
      energyButtons.forEach(b => {
        b.classList.remove("bg-blue-900", "text-white", "border-blue-900");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "true");

      if (btn.dataset.commodity === "oil") {
        drawLineChartEnergy("#chart-energy", "#tooltip-energy", ['CRUDE_WTI', 'CRUDE_BRENT', 'CRUDE_DUBAI', 'CRUDE_PETRO'], "oil");
      } else if (btn.dataset.commodity === "gas") {
        drawLineChartEnergy("#chart-energy", "#tooltip-energy", ['iNATGAS', 'NGAS_US', 'NGAS_JP', 'NGAS_EUR'], "gas");
      } else if (btn.dataset.commodity === "coal") {
        drawLineChartEnergy("#chart-energy", "#tooltip-energy", ['COAL_AUS', 'COAL_SAFRICA'], "coal");
      }
    });
  });

  // Event listeners for Category buttons (Insight 2)
  const categoryButtons = document.querySelectorAll(".category-filter-btn");
  categoryButtons.forEach((btn, idx) => {
    if (idx === 0) { // first button active
      btn.classList.add("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "false");
    }
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => {
        b.classList.remove("bg-blue-900", "text-white", "border-blue-900");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "true");

      let selectedCategory = btn.dataset.category;
      let selectedCommodities;

      switch(selectedCategory) {
        case "metals":
          selectedCommodities = metalsCommodities;
          break;
        case "mineral_fertilizers":
          selectedCommodities = mineralFertilizersCommodities;
          break;
        default:
          selectedCommodities = [];
      }

      drawHeatmapCategory("#chart-category-heatmap", "#tooltip-category-heatmap", selectedCommodities);
    });
  });

  // Event listeners for Food category buttons (Insight 3)
  const foodCategoryButtons = document.querySelectorAll(".food-category-btn");
  foodCategoryButtons.forEach((btn, idx) => {
    if (idx === 0) { // first button active
      btn.classList.add("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "false");
    }
    btn.addEventListener("click", () => {
      foodCategoryButtons.forEach(b => {
        b.classList.remove("bg-blue-900", "text-white", "border-blue-900");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("bg-blue-900", "text-white", "border-blue-900");
      btn.setAttribute("aria-pressed", "true");

      let selectedCategory = btn.dataset.category;
      let selectedCommodities;

      switch(selectedCategory) {
        case 'seafood':
          selectedCommodities = seafoodCommodities;
          break;
        case 'animal_products':
          selectedCommodities = animalProductsCommodities;
          break;
        case 'agriculture':
          selectedCommodities = agricultureCommodities;
          break;
        case 'plantations':
          selectedCommodities = plantationsCommodities;
          break;
        case 'vegetable_oils':
          selectedCommodities = vegetableOilsCommodities;
          break;
        case 'non_food_agriculture':
          selectedCommodities = nonFoodAgricultureCommodities;
          break;
        case 'processed_products':
          selectedCommodities = processedProductsCommodities;
          break;
        case 'timber':
          selectedCommodities = timberCommodities;
          break;
        default:
          selectedCommodities = [];
      }

      drawAreaChartFood("#chart-food", "#tooltip-food", selectedCommodities);
    });
  });

  // Load CSV data and render default views
  d3.csv("Selected_International_Commodity_Prices_with_Category.csv").then(data => {
    allData = data;

    // Default Insight 1 - Oil
    drawLineChartEnergy("#chart-energy", "#tooltip-energy", ['CRUDE_WTI', 'CRUDE_BRENT', 'CRUDE_DUBAI', 'CRUDE_PETRO'], "oil");

    // Default Insight 2 - Metals
    drawHeatmapCategory("#chart-category-heatmap", "#tooltip-category-heatmap", metalsCommodities);

    // Default Insight 3 - Seafood
    drawAreaChartFood("#chart-food", "#tooltip-food", seafoodCommodities);
  });

