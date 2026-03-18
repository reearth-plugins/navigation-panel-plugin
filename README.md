# Re:Earth Visualizer Plugin - Navigation Panel

A sleek, intuitive navigation control panel for Re:Earth Visualizer that provides smooth camera movement and zoom controls with visual feedback.

## Features

### Navigation Controls

- **Directional Movement**: Navigate in four directions (up, down, left, right) relative to your current camera view
- **Home Button**: Instantly return to your predefined home camera position
- **Heading-Aware Movement**: Controls automatically adapt to camera rotation - "up" always moves forward in the direction you're facing, even when the camera is rotated

### Zoom Controls

- **Zoom In/Out**: Smooth 2x zoom controls that work consistently at any altitude
- **Smart Scaling**: Zoom behavior adapts to your current camera height for natural interaction

### Smart Movement System

- **Viewport-Based Movement**: Each directional button moves the camera by a fraction of your visible screen area, ensuring consistent visual feedback regardless of zoom level
- **Coordinate Normalization**: Seamlessly handles movement across the international date line and poles
- **Movement Accumulation**: Multiple rapid clicks are smoothly combined for precise navigation

### Visual Feedback

- **Ripple Animation**: Material Design-style ripple effect provides instant visual feedback on button clicks
- **Smooth Transitions**: All camera movements use smooth animations (0.4s duration) for a polished experience

## Customization Options

Configure the plugin's appearance through the Re:Earth widget settings:

### General Settings

- **Home Camera Position**: Set your default camera position that the home button returns to

### Appearance Settings

- **Background Color**: Customize the panel background color
- **Icon Color**: Change the color of navigation and zoom icons
- **Corner Radius**: Adjust the roundness of panel corners
- **Border**: Toggle border visibility and customize border color and width

## How It Works

### Movement Behavior

- **Forward/Backward**: Moves along your current heading direction by 1/3 of viewport height
- **Left/Right**: Moves perpendicular to your heading by 1/3 of viewport width
- **Zoom In**: Reduces camera height by 50% (gets 2x closer)
- **Zoom Out**: Increases camera height by 50% (gets 2x farther)

### Camera Orientation Support

The plugin respects your camera's current orientation. If you rotate the camera to face east:

- Up button → moves east (forward)
- Down button → moves west (backward)
- Left button → moves north (left relative to east)
- Right button → moves south (right relative to east)

This makes the controls intuitive regardless of your camera angle, perfect for exploring tilted or rotated views.

## Usage

1. Add the Navigation Panel widget to your Re:Earth visualizer
2. Position it where you want on your screen
3. Configure your home camera position and appearance preferences
4. Click the directional arrows to navigate, use zoom controls to adjust altitude
5. Click the home button to return to your starting position

## Technical Details

- Built with React 19 and TypeScript
- Uses Tailwind CSS for styling
- Smooth camera animations with configurable duration
- Handles coordinate wraparound for seamless global navigation
