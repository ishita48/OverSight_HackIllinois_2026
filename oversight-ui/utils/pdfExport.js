import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const exportProfileToPDF = async (profileData, user) => {
  try {
    // Create a temporary container for the PDF content
    const pdfContainer = document.createElement("div");
    pdfContainer.style.position = "absolute";
    pdfContainer.style.left = "-9999px";
    pdfContainer.style.top = "0";
    pdfContainer.style.width = "800px";
    pdfContainer.style.backgroundColor = "#FDFCFB";
    pdfContainer.style.padding = "40px";
    pdfContainer.style.fontFamily = "Inter, system-ui, sans-serif";

    // Create the PDF content HTML
    const htmlContent = `
      <div style="max-width: 720px; margin: 0 auto; background: #FDFCFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 60px; padding: 40px 0; background: #F7F5F2; border-radius: 20px;">
          <div style="width: 120px; height: 120px; background: #D4735F; border-radius: 50%; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 40px rgba(212, 115, 95, 0.3);">
            ${
              user?.imageUrl
                ? `<img src="${user.imageUrl}" alt="${user.firstName} ${user.lastName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`
                : `<div style="color: white; font-size: 48px; font-weight: bold;">${
                    user?.firstName?.charAt(0) || "F"
                  }</div>`
            }
          </div>
          <h1 style="font-size: 42px; font-weight: 300; color: #2C2825; margin: 0 0 15px 0;">${
            user?.firstName
          } ${user?.lastName}</h1>
          <div style="font-size: 20px; color: #D4735F; font-weight: 500; margin-bottom: 30px;">The Visionary Builder</div>
          <blockquote style="font-size: 28px; font-style: italic; color: #2C2825; margin: 0; line-height: 1.4;">
            "${profileData.headlineTruth}"
          </blockquote>
          <div style="margin-top: 25px; font-size: 16px; color: #6B6560;">
            <span style="color: #D4735F; font-weight: 600;">${
              profileData.metadata.totalSessions
            }</span> sessions • 
            <span style="color: #8B9DC3; font-weight: 600;">${
              profileData.metadata.totalProjects
            }</span> projects • 
            <span style="color: #DDB892; font-weight: 600;">One unfolding story</span>
          </div>
        </div>

        <!-- Your Driving Truth -->
        <div style="margin-bottom: 50px; padding: 40px; background: #F9F7F5; border-radius: 20px; border: 1px solid #F0EBE8;">
          <h2 style="font-size: 32px; color: #2C2825; margin: 0 0 25px 0; text-align: center;">Your Driving Truth</h2>
          <blockquote style="font-size: 24px; font-style: italic; color: #2C2825; margin: 0; text-align: center; line-height: 1.5;">
            "${profileData.yourTruth}"
          </blockquote>
        </div>

        <!-- Growth Arc -->
        <div style="margin-bottom: 50px;">
          <h2 style="font-size: 32px; color: #2C2825; margin: 0 0 30px 0; text-align: center;">The Growth Arc</h2>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(44, 40, 37, 0.1);">
            <div style="margin-bottom: 30px;">
              <div style="display: flex; align-items: flex-start;">
                <div style="width: 20px; height: 20px; background: #D4735F; border-radius: 50%; margin-right: 20px; margin-top: 5px; flex-shrink: 0;"></div>
                <div>
                  <h3 style="font-size: 20px; color: #D4735F; margin: 0 0 10px 0;">Early</h3>
                  <p style="color: #2C2825; margin: 0; line-height: 1.6; font-size: 16px;">${
                    profileData.growthArc?.early ||
                    "Starting the journey with curiosity and questions."
                  }</p>
                </div>
              </div>
            </div>
            <div style="margin-bottom: 30px;">
              <div style="display: flex; align-items: flex-start;">
                <div style="width: 20px; height: 20px; background: #8B9DC3; border-radius: 50%; margin-right: 20px; margin-top: 5px; flex-shrink: 0;"></div>
                <div>
                  <h3 style="font-size: 20px; color: #8B9DC3; margin: 0 0 10px 0;">Middle</h3>
                  <p style="color: #2C2825; margin: 0; line-height: 1.6; font-size: 16px;">${
                    profileData.growthArc?.middle ||
                    "Navigating challenges and discovering deeper truths."
                  }</p>
                </div>
              </div>
            </div>
            <div>
              <div style="display: flex; align-items: flex-start;">
                <div style="width: 20px; height: 20px; background: #DDB892; border-radius: 50%; margin-right: 20px; margin-top: 5px; flex-shrink: 0;"></div>
                <div>
                  <h3 style="font-size: 20px; color: #DDB892; margin: 0 0 10px 0;">Now</h3>
                  <p style="color: #2C2825; margin: 0; line-height: 1.6; font-size: 16px;">${
                    profileData.growthArc?.now ||
                    "Building with clarity and conviction."
                  }</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Founder DNA -->
        ${
          profileData.founderDNA && profileData.founderDNA.length > 0
            ? `
        <div style="margin-bottom: 50px;">
          <h2 style="font-size: 32px; color: #2C2825; margin: 0 0 30px 0; text-align: center;">Your Founder DNA</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            ${profileData.founderDNA
              .map((trait, index) => {
                const traitData =
                  typeof trait === "string"
                    ? { trait, description: "" }
                    : trait;
                const colors = ["#D4735F", "#8B9DC3", "#DDB892"];
                const color = colors[index % 3];
                const bgColor =
                  index % 3 === 0
                    ? "#FDF6F4"
                    : index % 3 === 1
                    ? "#F4F6FA"
                    : "#FAF8F5";
                return `
                <div style="padding: 20px; background: ${bgColor}; border-radius: 15px; border: 1px solid ${color}40;">
                  <div style="display: inline-block; padding: 8px 16px; background: ${color}30; color: ${color}; border-radius: 20px; font-size: 14px; font-weight: 600; margin-bottom: 15px;">
                    ${traitData.trait || traitData.name || traitData}
                  </div>
                  ${
                    traitData.description
                      ? `<p style="color: #2C2825; margin: 0; font-size: 14px; line-height: 1.5;">${traitData.description}</p>`
                      : ""
                  }
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- Projects -->
        ${
          profileData.metadata.projects &&
          profileData.metadata.projects.length > 0
            ? `
        <div style="margin-bottom: 50px;">
          <h2 style="font-size: 32px; color: #2C2825; margin: 0 0 30px 0; text-align: center;">Projects You've Built</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
            ${profileData.metadata.projects
              .map(
                (project) => `
              <div style="padding: 25px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(44, 40, 37, 0.1); border: 1px solid #F7F5F2;">
                <div style="width: 50px; height: 50px; background: #D4735F; border-radius: 15px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center;">
                  <div style="color: white; font-size: 20px;">🎯</div>
                </div>
                <h3 style="font-size: 18px; color: #2C2825; margin: 0 0 15px 0;">${project.title}</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                  <span style="padding: 4px 12px; background: #F4F6FA; color: #8B9DC3; border-radius: 20px; font-size: 12px; font-weight: 500;">
                    ${project.sessionCount} sessions
                  </span>
                  <span style="padding: 4px 12px; background: #FAF8F5; color: #DDB892; border-radius: 20px; font-size: 12px; font-weight: 500;">
                    ${project.stage}
                  </span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- Honest Quotes -->
        ${
          profileData.honestQuotes && profileData.honestQuotes.length > 0
            ? `
        <div style="margin-bottom: 50px;">
          <h2 style="font-size: 32px; color: #2C2825; margin: 0 0 30px 0; text-align: center;">Your Internal Monologue</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px;">
            ${profileData.honestQuotes
              .slice(0, 3)
              .map(
                (quote) => `
              <div style="padding: 25px; background: #FEFEFE; border-radius: 20px; box-shadow: 0 10px 30px rgba(44, 40, 37, 0.1); border: 1px solid #F7F5F2;">
                <div style="width: 40px; height: 40px; background: #F9F7F5; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                  <div style="color: #D4735F; font-size: 18px;">"</div>
                </div>
                <p style="color: #2C2825; margin: 0; font-style: italic; line-height: 1.6; font-size: 16px;">
                  "${quote}"
                </p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
        `
            : ""
        }

        <!-- Full Narrative -->
        <div style="margin-bottom: 50px;">
          <h2 style="font-size: 32px; color: #2C2825; margin: 0 0 30px 0; text-align: center;">Your Full Narrative</h2>
          <div style="padding: 40px; background: white; border-radius: 20px; box-shadow: 0 10px 30px rgba(44, 40, 37, 0.1);">
            <p style="color: #2C2825; margin: 0; line-height: 1.8; font-size: 18px; font-weight: 300;">
              ${profileData.emotionalBio}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 40px 0; border-top: 1px solid #F7F5F2; color: #6B6560; font-size: 14px;">
          <div style="margin-bottom: 10px;">Generated from OverSight</div>
          <div>Your founder journey, beautifully captured • ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    `;

    pdfContainer.innerHTML = htmlContent;
    document.body.appendChild(pdfContainer);

    // Wait for any images to load
    const images = pdfContainer.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        });
      })
    );

    // Generate canvas from the container
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#FDFCFB",
      width: 800,
      height: pdfContainer.scrollHeight,
      scrollX: 0,
      scrollY: 0,
    });

    // Clean up
    document.body.removeChild(pdfContainer);

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // Download the PDF
    const fileName = `${user?.firstName || "Founder"}_${
      user?.lastName || "Profile"
    }_OverSight.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
